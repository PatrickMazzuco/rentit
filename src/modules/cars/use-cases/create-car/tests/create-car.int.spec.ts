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

  const setupTestData = async ({ isUserAdmin = true }) => {
    // Create a user
    const userData = getCreateUserDTO();

    const { body: createdUser } = await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    await usersRepository.update({
      ...createdUser,
      isAdmin: true,
    });

    const user = {
      email: userData.email,
      username: userData.username,
      password: userData.password,
    };

    // Authenticate user
    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: userData.email,
        password: userData.password,
      });

    // Create a category
    const categoryData = getCreateCategoryDTO();

    const createdCategoryResponse = await request(app.getHttpServer())
      .post("/categories")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    const category: CategoryDTO = createdCategoryResponse.body;

    // Remove admin role from user before returning
    if (!isUserAdmin) {
      await usersRepository.update({
        ...createdUser,
        isAdmin: false,
      });
    }

    return {
      user,
      category,
      accessToken: authResponse.accessToken,
    };
  };

  it("should be able to create a new car", async () => {
    const { category, accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    const carData = {
      ...getCreateCarDTO(),
      categoryId: category.id,
    };

    const createdCarResponse = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${accessToken}`)
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
    const { category, accessToken } = await setupTestData({
      isUserAdmin: true,
    });
    const carData = {
      ...getCreateCarDTO(),
      categoryId: category.id,
    };

    await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(carData)
      .expect(HttpStatus.CREATED);

    const createdCarResponse = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(carData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdCarResponse.body).toHaveProperty(
      "message",
      CarErrorMessage.ALREADY_EXISTS,
    );
  });

  it("should not be able to create a car for an inexistent category", async () => {
    const { accessToken } = await setupTestData({ isUserAdmin: true });
    const carData = getCreateCarDTO();

    const createdCarResponse = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(carData)
      .expect(HttpStatus.NOT_FOUND);

    expect(createdCarResponse.body).toHaveProperty(
      "message",
      CategoryErrorMessage.NOT_FOUND,
    );
  });

  it("should not be able to create a car if the user is not an admin", async () => {
    const { category, accessToken } = await setupTestData({
      isUserAdmin: false,
    });
    const carData = {
      ...getCreateCarDTO(),
      categoryId: category.id,
    };

    const createdCarResponse = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(carData)
      .expect(HttpStatus.FORBIDDEN);

    expect(createdCarResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INSUFFICIENT_PERMISSION,
    );
  });
});
