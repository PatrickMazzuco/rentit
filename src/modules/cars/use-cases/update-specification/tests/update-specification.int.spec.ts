import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { SpecificationDTO } from "@modules/cars/dtos/specification.dto";
import { SpecificationErrorMessage } from "@modules/cars/errors/specification-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateSpecificationDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[PUT] /specifications/{id}", () => {
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

    // Create a specification
    const specificationData = getCreateSpecificationDTO();

    const createdSpecificationResponse = await request(app.getHttpServer())
      .post("/specifications")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    const specification: SpecificationDTO = createdSpecificationResponse.body;

    // Remove admin role from user before returning
    if (!isUserAdmin) {
      await usersRepository.update({
        ...createdUser,
        isAdmin: false,
      });
    }

    return {
      user,
      specification,
      accessToken: authResponse.accessToken,
    };
  };

  it("should be able to update a specification", async () => {
    const { specification, accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    const updatedSpecificationData = {
      name: "Updated Specification",
      description: "Updated Description",
    };

    await request(app.getHttpServer())
      .put(`/specifications/${specification.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedSpecificationData)
      .expect(HttpStatus.NO_CONTENT);

    const { body: foundSpecification } = await request(app.getHttpServer())
      .get(`/specifications/${specification.id}`)
      .expect(HttpStatus.OK);

    expect(foundSpecification).toHaveProperty("id", specification.id);
    expect(foundSpecification).toEqual(
      expect.objectContaining({
        name: updatedSpecificationData.name,
        description: updatedSpecificationData.description,
      }),
    );
  });

  it("should not be able to update a specification to have a duplicated name", async () => {
    const { specification, accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    const updatedSpecificationData = {
      name: specification.name,
      description: "Updated Description",
    };

    const { body: updatedSpecification } = await request(app.getHttpServer())
      .put(`/specifications/${specification.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedSpecificationData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(updatedSpecification).toHaveProperty(
      "message",
      SpecificationErrorMessage.ALREADY_EXISTS,
    );
  });

  it("should not be able to update an inexistent specification", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: true,
    });
    const updatedSpecificationData = {
      name: "Updated Specification",
      description: "Updated Description",
    };

    const { body: updatedSpecification } = await request(app.getHttpServer())
      .put(`/specifications/${uuidV4()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedSpecificationData)
      .expect(HttpStatus.NOT_FOUND);

    expect(updatedSpecification).toHaveProperty(
      "message",
      SpecificationErrorMessage.NOT_FOUND,
    );
  });

  it("should not be able to update a specification if the user is not an admin", async () => {
    const { specification, accessToken } = await setupTestData({
      isUserAdmin: false,
    });
    const updatedSpecificationData = {
      name: "Updated Specification",
      description: "Updated Description",
    };

    const { body: updatedSpecification } = await request(app.getHttpServer())
      .put(`/specifications/${specification.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedSpecificationData)
      .expect(HttpStatus.FORBIDDEN);

    expect(updatedSpecification).toHaveProperty(
      "message",
      AuthErrorMessage.INSUFFICIENT_PERMISSION,
    );
  });
});
