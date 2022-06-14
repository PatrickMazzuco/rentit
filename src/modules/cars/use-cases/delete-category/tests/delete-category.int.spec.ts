import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[DELETE] /categories/{id}", () => {
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

  it("should be able to delete a category", async () => {
    const { category, accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    await request(app.getHttpServer())
      .delete(`/categories/${category.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/categories/${category.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it("should not return error when deleting an inexistent category", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: true,
    });
    const id = uuidV4();

    await request(app.getHttpServer())
      .delete(`/categories/${id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/categories/${id}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it("should not be able to delete a category if the user is not an admin", async () => {
    const { category, accessToken } = await setupTestData({
      isUserAdmin: false,
    });

    const createdCategoryResponse = await request(app.getHttpServer())
      .delete(`/categories/${category.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.FORBIDDEN);

    expect(createdCategoryResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INSUFFICIENT_PERMISSION,
    );
  });
});
