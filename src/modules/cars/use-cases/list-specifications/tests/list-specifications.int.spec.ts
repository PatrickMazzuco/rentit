import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { SpecificationDTO } from "@modules/cars/dtos/specification.dto";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { SortingOrder } from "@shared/enums/sorting-order.enum";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateSpecificationDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[GET] /specifications", () => {
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

    // Create specifications
    const specificationData = {
      ...getCreateSpecificationDTO(),
      name: "Specification 1",
    };
    const secondSpecification = {
      ...getCreateSpecificationDTO(),
      name: "Specification 2",
    };

    const { body: createdSpecification } = await request(app.getHttpServer())
      .post("/specifications")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    const { body: createdSecondSpecification } = await request(
      app.getHttpServer(),
    )
      .post("/specifications")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(secondSpecification)
      .expect(HttpStatus.CREATED);

    const specifications: SpecificationDTO[] = [
      createdSpecification,
      createdSecondSpecification,
    ];

    // Remove admin role from user before returning
    if (!isUserAdmin) {
      await usersRepository.update({
        ...createdUser,
        isAdmin: false,
      });
    }

    return {
      user,
      specifications,
      accessToken: authResponse.accessToken,
    };
  };

  it("should be able to list specifications", async () => {
    const { specifications } = await setupTestData({ isUserAdmin: true });

    const { body: foundSpecifications } = await request(app.getHttpServer())
      .get("/specifications")
      .send()
      .expect(HttpStatus.OK);

    expect(foundSpecifications).toHaveProperty("data");
    expect(foundSpecifications).toHaveProperty("meta");
    expect(foundSpecifications).toHaveProperty("links");
    expect(foundSpecifications.data).toHaveLength(2);
    expect(foundSpecifications.data[0]).toHaveProperty(
      "id",
      specifications[0].id,
    );
  });

  it("should be able to list specifications with filters", async () => {
    const { specifications } = await setupTestData({ isUserAdmin: true });

    const { body: foundSpecifications } = await request(app.getHttpServer())
      .get("/specifications")
      .query({ _order: SortingOrder.DESC })
      .send()
      .expect(HttpStatus.OK);

    expect(foundSpecifications).toHaveProperty("data");
    expect(foundSpecifications).toHaveProperty("meta");
    expect(foundSpecifications).toHaveProperty("links");
    expect(foundSpecifications.data).toHaveLength(2);
    expect(foundSpecifications.data[0]).toHaveProperty(
      "id",
      specifications[1].id,
    );
  });
});
