import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import { CarErrorMessage } from "@modules/cars/errors/car-error-messages.enum";
import { CategoryErrorMessage } from "@modules/cars/errors/category-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCarDTO, getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[POST] /cars", () => {
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

  const createUser = async (isAdmin = true) => {
    const userData = getCreateUserDTO();

    const { body: createdUser } = await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    if (isAdmin) {
      await usersRepository.update({
        ...createdUser,
        isAdmin: true,
      });
    }

    return {
      email: userData.email,
      username: userData.username,
      password: userData.password,
    };
  };

  it("should be able to create a new car", async () => {
    const category = await createCategory();
    const carData = {
      ...getCreateCarDTO(),
      categoryId: category.id,
    };

    const user = await createUser();

    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: user.email,
        password: user.password,
      });

    const createdCarResponse = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(carData)
      .expect(HttpStatus.CREATED);

    expect(createdCarResponse.body).toHaveProperty("id");
    expect(createdCarResponse.body).toEqual(
      expect.objectContaining({
        ...carData,
        available: true,
      }),
    );
  });

  it("should not be able to create a car with duplicated licence plate", async () => {
    const category = await createCategory();
    const carData = {
      ...getCreateCarDTO(),
      categoryId: category.id,
    };

    const user = await createUser();

    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: user.email,
        password: user.password,
      });

    await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(carData)
      .expect(HttpStatus.CREATED);

    const createdCarResponse = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(carData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdCarResponse.body).toHaveProperty(
      "message",
      CarErrorMessage.ALREADY_EXISTS,
    );
  });

  it("should not be able to create a car for an inexistent category", async () => {
    const carData = getCreateCarDTO();
    const user = await createUser();

    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: user.email,
        password: user.password,
      });

    const createdCarResponse = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(carData)
      .expect(HttpStatus.NOT_FOUND);

    expect(createdCarResponse.body).toHaveProperty(
      "message",
      CategoryErrorMessage.NOT_FOUND,
    );
  });

  it("should not be able to create a car if the user is not an admin", async () => {
    const category = await createCategory();
    const carData = {
      ...getCreateCarDTO(),
      categoryId: category.id,
    };
    const user = await createUser(false);

    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: user.email,
        password: user.password,
      });

    const createdCarResponse = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(carData)
      .expect(HttpStatus.FORBIDDEN);

    expect(createdCarResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INSUFFICIENT_PERMISSION,
    );
  });
});
