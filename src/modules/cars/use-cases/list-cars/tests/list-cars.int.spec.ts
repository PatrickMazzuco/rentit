import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { SortingOrder } from "@shared/enums/sorting-order.enum";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCarDTO, getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[GET] /cars", () => {
  let app: INestApplication;

  let clearDatabase: ClearDatabase;
  let usersRepository: IUsersRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CarsModule],
    }).compile();

    clearDatabase = moduleRef.get<ClearDatabase>(ClearDatabase);
    usersRepository = await moduleRef.resolve<IUsersRepository>(
      RepositoryToken.USERS_REPOSITORY,
    );

    app = moduleRef.createNestApplication();

    setupGlobalPipes({ app });
    setupGlobalFilters({ app });

    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase.execute();
  });

  afterAll(async () => {
    await app.close();
  });

  const createCategory = async (): Promise<CategoryDTO> => {
    const categoryData = getCreateCategoryDTO();

    const { body: createdCategory } = await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    return createdCategory;
  };

  const createCars = async () => {
    const userData = getCreateUserDTO();
    const category = await createCategory();

    const { body: createdUser } = await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    await usersRepository.update({
      ...createdUser,
      isAdmin: true,
    });

    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: userData.email,
        password: userData.password,
      });

    const carData = {
      ...getCreateCarDTO(),
      categoryId: category.id,
      name: "Car 1",
      licensePlate: "AAA-111",
    };
    const secondCar = {
      ...getCreateCarDTO(),
      categoryId: category.id,
      name: "Car 2",
      licensePlate: "BBB-222",
    };

    const { body: createdCar } = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(carData)
      .expect(HttpStatus.CREATED);

    const { body: createdSecondCar } = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(secondCar)
      .expect(HttpStatus.CREATED);

    return [createdCar, createdSecondCar];
  };

  it("should be able to list cars", async () => {
    const [createdCar] = await createCars();

    const { body: foundCars } = await request(app.getHttpServer())
      .get("/cars")
      .send()
      .expect(HttpStatus.OK);

    expect(foundCars).toHaveProperty("data");
    expect(foundCars).toHaveProperty("meta");
    expect(foundCars).toHaveProperty("links");
    expect(foundCars.data).toHaveLength(2);
    expect(foundCars.data[0]).toHaveProperty("id", createdCar.id);
  });

  it("should be able to list cars with ordering", async () => {
    const [_, secondCreatedCar] = await createCars();

    const { body: foundCars } = await request(app.getHttpServer())
      .get("/cars")
      .query({ _order: SortingOrder.DESC })
      .send()
      .expect(HttpStatus.OK);

    expect(foundCars).toHaveProperty("data");
    expect(foundCars).toHaveProperty("meta");
    expect(foundCars).toHaveProperty("links");
    expect(foundCars.data).toHaveLength(2);
    expect(foundCars.data[0]).toHaveProperty("id", secondCreatedCar.id);
  });

  it("should be able to list cars with filters", async () => {
    const [_, secondCreatedCar] = await createCars();

    const { body: foundCars } = await request(app.getHttpServer())
      .get("/cars")
      .query({ name: secondCreatedCar.name })
      .send()
      .expect(HttpStatus.OK);

    expect(foundCars).toHaveProperty("data");
    expect(foundCars).toHaveProperty("meta");
    expect(foundCars).toHaveProperty("links");
    expect(foundCars.data).toHaveLength(1);
    expect(foundCars.data[0]).toHaveProperty("id", secondCreatedCar.id);
  });
});
