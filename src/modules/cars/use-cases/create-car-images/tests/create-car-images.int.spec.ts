import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { CarDTO } from "@modules/cars/dtos/car.dto";
import { CarErrorMessage } from "@modules/cars/errors/car-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCarDTO } from "@utils/tests/mocks/cars";
import * as path from "node:path";
import * as request from "supertest";

const testAssetsFolder = "../../../../../utils/tests/assets";

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
      car,
      accessToken: authResponse.accessToken,
    };
  };

  it("should be able to add images to a car", async () => {
    const { car, accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    const newAvatar = path.resolve(
      __dirname,
      testAssetsFolder,
      `./png-test-image.png`,
    );

    await request(app.getHttpServer())
      .post(`/cars/${car.id}/images`)
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("images", newAvatar)
      .expect(HttpStatus.CREATED);
  });

  it("should not be able to add images to an inexistent car", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    const newAvatar = path.resolve(
      __dirname,
      testAssetsFolder,
      `./png-test-image.png`,
    );

    const createdCarImageResponse = await request(app.getHttpServer())
      .post(`/cars/${uuidV4()}/images`)
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("images", newAvatar)
      .expect(HttpStatus.NOT_FOUND);

    expect(createdCarImageResponse.body).toHaveProperty(
      "message",
      CarErrorMessage.NOT_FOUND,
    );
  });

  it("should be able to add images with invalid extensions to a car", async () => {
    const { car, accessToken } = await setupTestData({
      isUserAdmin: true,
    });

    const newAvatar = path.resolve(
      __dirname,
      testAssetsFolder,
      `./gif-test-image.gif`,
    );

    await request(app.getHttpServer())
      .post(`/cars/${car.id}/images`)
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("images", newAvatar)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("should be able to add images to a car if the user is not an admin", async () => {
    const { car, accessToken } = await setupTestData({
      isUserAdmin: false,
    });

    const newAvatar = path.resolve(
      __dirname,
      testAssetsFolder,
      `./png-test-image.png`,
    );

    const createdCarImageResponse = await request(app.getHttpServer())
      .post(`/cars/${car.id}/images`)
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("images", newAvatar)
      .expect(HttpStatus.FORBIDDEN);

    expect(createdCarImageResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INSUFFICIENT_PERMISSION,
    );
  });
});
