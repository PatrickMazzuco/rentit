import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
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

describe("[GET] /specifications/{id}", () => {
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

  it("should be able to find an existing specification", async () => {
    const { specification } = await setupTestData({
      isUserAdmin: true,
    });

    const { body: foundSpecification } = await request(app.getHttpServer())
      .get(`/specifications/${specification.id}`)
      .expect(HttpStatus.OK);

    expect(foundSpecification).toHaveProperty("id", specification.id);
    expect(foundSpecification).toEqual(
      expect.objectContaining({
        name: specification.name,
        description: specification.description,
      }),
    );
  });

  it("should not be able to find an inexistent specification", async () => {
    const { body: foundSpecification } = await request(app.getHttpServer())
      .get(`/specifications/${uuidV4()}`)
      .expect(HttpStatus.NOT_FOUND);

    expect(foundSpecification).toHaveProperty(
      "message",
      SpecificationErrorMessage.NOT_FOUND,
    );
  });
});
