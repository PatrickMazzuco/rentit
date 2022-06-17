import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { CarDTO } from "@modules/cars/dtos/car.dto";
import { CarErrorMessage } from "@modules/cars/errors/car-error-messages.enum";
import { RentalErrorMessage } from "@modules/cars/errors/rental-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCarDTO, getCreateRentalDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[POST] /rentals", () => {
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

    const secondCar = {
      ...getCreateCarDTO(),
      name: "Car 2",
      licensePlate: "BBB-222",
    };
    delete secondCar.categoryId;

    const { body: createdCar } = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(carData)
      .expect(HttpStatus.CREATED);

    const { body: createdSecondCar } = await request(app.getHttpServer())
      .post("/cars")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(secondCar)
      .expect(HttpStatus.CREATED);

    const cars: CarDTO[] = [createdCar, createdSecondCar];

    // Remove admin role from user before returning
    if (!isUserAdmin) {
      await usersRepository.update({
        ...createdUser,
        isAdmin: false,
      });
    }

    return {
      user,
      cars,
      accessToken: authResponse.accessToken,
    };
  };

  it("should be able to create a new rental", async () => {
    const {
      cars: [car],
      accessToken,
    } = await setupTestData({
      isUserAdmin: false,
    });

    const { expectedReturnDate } = getCreateRentalDTO();

    const rentalData = {
      expectedReturnDate,
      carId: car.id,
    };

    const { body: createdRental } = await request(app.getHttpServer())
      .post(`/rentals`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(rentalData)
      .expect(HttpStatus.CREATED);

    expect(createdRental).toHaveProperty("id");
    expect(createdRental).toHaveProperty("startDate");
    expect(createdRental).toHaveProperty("car");
    expect(createdRental).toHaveProperty("user");
  });

  it("should not be able to create a new rental for an inexistent car", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: false,
    });

    const { expectedReturnDate } = getCreateRentalDTO();

    const rentalData = {
      expectedReturnDate,
      carId: uuidV4(),
    };

    const { body: createdRental } = await request(app.getHttpServer())
      .post(`/rentals`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(rentalData)
      .expect(HttpStatus.NOT_FOUND);

    expect(createdRental).toHaveProperty("message", CarErrorMessage.NOT_FOUND);
  });

  it("should not be able to create a new rental with a short renting duration", async () => {
    const {
      cars: [car],
      accessToken,
    } = await setupTestData({
      isUserAdmin: false,
    });

    const rentalData = {
      expectedReturnDate: new Date(),
      carId: car.id,
    };

    await request(app.getHttpServer())
      .post(`/rentals`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(rentalData)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("should not be able to create a new rental for a car that is already being rented", async () => {
    const {
      cars: [car],
      accessToken,
    } = await setupTestData({
      isUserAdmin: false,
    });

    const { expectedReturnDate } = getCreateRentalDTO();

    const rentalData = {
      expectedReturnDate,
      carId: car.id,
    };

    await request(app.getHttpServer())
      .post(`/rentals`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(rentalData)
      .expect(HttpStatus.CREATED);

    const { body: createdRental } = await request(app.getHttpServer())
      .post(`/rentals`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(rentalData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdRental).toHaveProperty(
      "message",
      RentalErrorMessage.CAR_ALREADY_RENTED,
    );
  });

  it("should not be able to create a new rental for a user that is already renting a car", async () => {
    const {
      cars: [car, secondCar],
      accessToken,
    } = await setupTestData({
      isUserAdmin: false,
    });

    const { expectedReturnDate } = getCreateRentalDTO();

    const rentalData = {
      expectedReturnDate,
      carId: car.id,
    };

    const secondRentalData = {
      expectedReturnDate,
      carId: secondCar.id,
    };

    await request(app.getHttpServer())
      .post(`/rentals`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(rentalData)
      .expect(HttpStatus.CREATED);

    const { body: createdRental } = await request(app.getHttpServer())
      .post(`/rentals`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(secondRentalData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdRental).toHaveProperty(
      "message",
      RentalErrorMessage.USER_ALREADY_RENTING,
    );
  });
});
