import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { CategoryErrorMessage } from "@modules/cars/errors/category-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[POST] /categories", () => {
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

    // Remove admin role from user before returning
    if (!isUserAdmin) {
      await usersRepository.update({
        ...createdUser,
        isAdmin: false,
      });
    }

    return {
      user,
      accessToken: authResponse.accessToken,
    };
  };

  it("should be able to create a new category", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: true,
    });
    const categoryData = getCreateCategoryDTO();

    const createdCategoryResponse = await request(app.getHttpServer())
      .post("/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    expect(createdCategoryResponse.body).toHaveProperty("id");
    expect(createdCategoryResponse.body).toEqual(
      expect.objectContaining({
        name: categoryData.name,
        description: categoryData.description,
      }),
    );
  });

  it("should not be able to create a category with duplicated name", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: true,
    });
    const categoryData = getCreateCategoryDTO();

    await request(app.getHttpServer())
      .post("/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    const createdCategoryResponse = await request(app.getHttpServer())
      .post("/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(categoryData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdCategoryResponse.body).toHaveProperty(
      "message",
      CategoryErrorMessage.ALREADY_EXISTS,
    );
  });

  it("should not be able to create a category if the user is not an admin", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: false,
    });
    const categoryData = getCreateCategoryDTO();

    const createdCategoryResponse = await request(app.getHttpServer())
      .post("/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(categoryData)
      .expect(HttpStatus.FORBIDDEN);

    expect(createdCategoryResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INSUFFICIENT_PERMISSION,
    );
  });
});
