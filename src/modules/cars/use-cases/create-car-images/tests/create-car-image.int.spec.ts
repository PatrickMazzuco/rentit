import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { CarDTO } from "@modules/cars/dtos/car.dto";
import { SpecificationDTO } from "@modules/cars/dtos/specification.dto";
import { CarErrorMessage } from "@modules/cars/errors/car-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import {
  getCreateCarDTO,
  getCreateSpecificationDTO,
} from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[POST] /cars/{id}/images", () => {
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

    // Create cars
    const carData = {
      ...getCreateCarDTO(),
      name: "Car 1",
      licensePlate: "AAA-111",
    };
    delete carData.categoryId;

    const { body: createdCar } = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(carData)
      .expect(HttpStatus.CREATED);

    const car: CarDTO = createdCar;

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
      car,
      accessToken: authResponse.accessToken,
    };
  };

  it("should be able to to add a specification to a car", async () => {
    const { car, specification, accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    await request(app.getHttpServer())
      .put(`/cars/${car.id}/specifications`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        specificationIds: [specification.id],
      })
      .expect(HttpStatus.NO_CONTENT);
  });

  it("should not be able to add an inexistent specification to a car", async () => {
    const { car, specification, accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    await request(app.getHttpServer())
      .put(`/cars/${car.id}/specifications`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        specificationIds: [specification.id, uuidV4()],
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it("should not be able to add a specification to an inexistent car", async () => {
    const { specification, accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    const createdCarResponse = await request(app.getHttpServer())
      .put(`/cars/${uuidV4()}/specifications`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        specificationIds: [specification.id],
      })
      .expect(HttpStatus.NOT_FOUND);

    expect(createdCarResponse.body).toHaveProperty(
      "message",
      CarErrorMessage.NOT_FOUND,
    );
  });

  it("should not be able to to add a specification to a car if the user is not an admin", async () => {
    const { car, specification, accessToken } = await setupTestData({
      isUserAdmin: false,
    });

    const createdCarResponse = await request(app.getHttpServer())
      .put(`/cars/${car.id}/specifications`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        specificationIds: [specification.id],
      })
      .expect(HttpStatus.FORBIDDEN);

    expect(createdCarResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INSUFFICIENT_PERMISSION,
    );
  });
});
