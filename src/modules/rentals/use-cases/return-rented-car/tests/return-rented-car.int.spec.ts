import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarDTO } from "@modules/cars/dtos/car.dto";
import { ClearDatabase } from "@modules/database/clear-database";
import { RentalDTO } from "@modules/rentals/dtos/rental.dto";
import { RentalErrorMessage } from "@modules/rentals/errors/rental-error-messages.enum";
import { RentalsModule } from "@modules/rentals/rentals.module";
import { IRentalsRepository } from "@modules/rentals/repositories/rentals-repository.interface";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCarDTO } from "@utils/tests/mocks/cars";
import { getCreateRentalDTO } from "@utils/tests/mocks/rentals";
import * as request from "supertest";

describe("[POST] /rentals/{id}/return", () => {
  let app: INestApplication;

  let clearDatabase: ClearDatabase;
  let usersRepository: IUsersRepository;
  let rentalsRepository: IRentalsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RentalsModule],
    }).compile();

    clearDatabase = moduleRef.get<ClearDatabase>(ClearDatabase);
    usersRepository = await moduleRef.resolve<IUsersRepository>(
      RepositoryToken.USERS_REPOSITORY,
    );
    rentalsRepository = await moduleRef.resolve<IRentalsRepository>(
      RepositoryToken.RENTALS_REPOSITORY,
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
    // Create users
    const userData = getCreateUserDTO();
    const secondUserData = {
      ...userData,
      username: "second-user",
      email: "email@test.com",
      password: "123456",
      driversLicense: "987654321",
    };

    const { body: createdUser } = await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post("/users")
      .send(secondUserData)
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

    const secondUser = {
      email: secondUserData.email,
      username: secondUserData.username,
      password: secondUserData.password,
    };

    // Authenticate users
    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: userData.email,
        password: userData.password,
      });

    const { body: secondAuthResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: secondUser.email,
        password: secondUser.password,
      });

    // Create car
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

    // Create rental
    const { expectedReturnDate } = getCreateRentalDTO();

    const rentalData = {
      expectedReturnDate,
      carId: car.id,
    };

    const { body: createdRental } = await request(app.getHttpServer())
      .post(`/rentals`)
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(rentalData)
      .expect(HttpStatus.CREATED);

    const rental: RentalDTO = createdRental;

    // Remove admin role from user before returning
    if (!isUserAdmin) {
      await usersRepository.update({
        ...createdUser,
        isAdmin: false,
      });
    }

    return {
      user,
      rental,
      accessToken: authResponse.accessToken,
      secondAccessToken: secondAuthResponse.accessToken,
    };
  };

  it("should be able to return a rented car", async () => {
    const { rental, accessToken } = await setupTestData({
      isUserAdmin: false,
    });

    const { body: returnedCarRental } = await request(app.getHttpServer())
      .post(`/rentals/${rental.id}/return`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK);

    expect(returnedCarRental).toHaveProperty("id");
    expect(returnedCarRental).toHaveProperty("total");
    expect(returnedCarRental).toHaveProperty("endDate");
  });

  it("should be able to return a rented car when overdue", async () => {
    const { rental, accessToken } = await setupTestData({
      isUserAdmin: false,
    });

    const currentDate = new Date();
    const newStartDate = new Date();
    newStartDate.setDate(currentDate.getDate() - 5);

    const newExpectedReturnDate = new Date();
    newExpectedReturnDate.setDate(currentDate.getDate() - 2);

    const updatedRental: RentalDTO = {
      ...rental,
      startDate: newStartDate,
      expectedReturnDate: newExpectedReturnDate,
    };
    await rentalsRepository.update(updatedRental);

    const { body: returnedCarRental } = await request(app.getHttpServer())
      .post(`/rentals/${rental.id}/return`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK);

    expect(returnedCarRental).toHaveProperty("id");
    expect(returnedCarRental).toHaveProperty("total");
    expect(returnedCarRental).toHaveProperty("endDate");
  });

  it("should not be able to return an inexistent rental", async () => {
    const { accessToken } = await setupTestData({
      isUserAdmin: false,
    });

    const { body: returnedCarRental } = await request(app.getHttpServer())
      .post(`/rentals/${uuidV4()}/return`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.NOT_FOUND);

    expect(returnedCarRental).toHaveProperty(
      "message",
      RentalErrorMessage.NOT_FOUND,
    );
  });

  it("should not be able to return a rental that was already returned", async () => {
    const { rental, accessToken } = await setupTestData({
      isUserAdmin: false,
    });

    await request(app.getHttpServer())
      .post(`/rentals/${rental.id}/return`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK);

    const { body: returnedCarRental } = await request(app.getHttpServer())
      .post(`/rentals/${rental.id}/return`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.BAD_REQUEST);

    expect(returnedCarRental).toHaveProperty(
      "message",
      RentalErrorMessage.RENTAL_ALREADY_RETURNED,
    );
  });

  it("should not be able to return a rental of another user", async () => {
    const { rental, secondAccessToken } = await setupTestData({
      isUserAdmin: false,
    });

    const { body: returnedCarRental } = await request(app.getHttpServer())
      .post(`/rentals/${rental.id}/return`)
      .set("Authorization", `Bearer ${secondAccessToken}`)
      .send()
      .expect(HttpStatus.FORBIDDEN);

    expect(returnedCarRental).toHaveProperty(
      "message",
      AuthErrorMessage.INSUFFICIENT_PERMISSION,
    );
  });
});
