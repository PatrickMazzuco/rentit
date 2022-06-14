import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { SpecificationErrorMessage } from "@modules/cars/errors/specification-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateSpecificationDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[POST] /specifications", () => {
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

  it("should be able to create a new specification", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: true,
    });
    const specificationData = getCreateSpecificationDTO();

    const createdSpecificationResponse = await request(app.getHttpServer())
      .post("/specifications")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    expect(createdSpecificationResponse.body).toHaveProperty("id");
    expect(createdSpecificationResponse.body).toEqual(
      expect.objectContaining({
        name: specificationData.name,
        description: specificationData.description,
      }),
    );
  });

  it("should not be able to create a specification with duplicated name", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: true,
    });
    const specificationData = getCreateSpecificationDTO();

    await request(app.getHttpServer())
      .post("/specifications")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    const createdSpecificationResponse = await request(app.getHttpServer())
      .post("/specifications")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(specificationData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdSpecificationResponse.body).toHaveProperty(
      "message",
      SpecificationErrorMessage.ALREADY_EXISTS,
    );
  });

  it("should not be able to create a specification if the user is not an admin", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: false,
    });
    const specificationData = getCreateSpecificationDTO();

    const createdSpecificationResponse = await request(app.getHttpServer())
      .post("/specifications")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(specificationData)
      .expect(HttpStatus.FORBIDDEN);

    expect(createdSpecificationResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INSUFFICIENT_PERMISSION,
    );
  });
});
