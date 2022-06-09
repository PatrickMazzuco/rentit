import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { IsAdmin } from "@modules/accounts/guards/admin.guard";
import { CarsModule } from "@modules/cars/cars.module";
import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import { CarErrorMessage } from "@modules/cars/errors/car-error-messages.enum";
import { CategoryErrorMessage } from "@modules/cars/errors/category-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCarDTO, getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[POST] /cars", () => {
  let app: INestApplication;

  let clearDatabase: ClearDatabase;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CarsModule],
    })
      .overrideGuard(IsAdmin)
      .useValue(true)
      .compile();

    clearDatabase = moduleRef.get<ClearDatabase>(ClearDatabase);

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

  const createUser = async () => {
    const userData = getCreateUserDTO();

    await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

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
});
