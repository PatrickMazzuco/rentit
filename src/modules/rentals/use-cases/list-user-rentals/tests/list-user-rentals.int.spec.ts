import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarDTO } from "@modules/cars/dtos/car.dto";
import { ClearDatabase } from "@modules/database/clear-database";
import { RentalDTO } from "@modules/rentals/dtos/rental.dto";
import { RentalsModule } from "@modules/rentals/rentals.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCarDTO } from "@utils/tests/mocks/cars";
import { getCreateRentalDTO } from "@utils/tests/mocks/rentals";
import * as request from "supertest";

describe("[GET] /rentals", () => {
  let app: INestApplication;

  let clearDatabase: ClearDatabase;
  let usersRepository: IUsersRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RentalsModule],
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

  it("should be able to list a user's rentals", async () => {
    const { accessToken } = await setupTestData({ isUserAdmin: false });

    const { body: foundRentals } = await request(app.getHttpServer())
      .get("/rentals")
      .set("Authorization", `Bearer ${accessToken}`)
      .send()
      .expect(HttpStatus.OK);

    expect(foundRentals).toHaveProperty("data");
    expect(foundRentals).toHaveProperty("meta");
    expect(foundRentals).toHaveProperty("links");
    expect(foundRentals.data).toHaveLength(1);
  });

  it("should not be able to list another user's rentals", async () => {
    const { secondAccessToken } = await setupTestData({ isUserAdmin: false });

    const { body: foundRentals } = await request(app.getHttpServer())
      .get("/rentals")
      .set("Authorization", `Bearer ${secondAccessToken}`)
      .send()
      .expect(HttpStatus.OK);

    expect(foundRentals).toHaveProperty("data");
    expect(foundRentals).toHaveProperty("meta");
    expect(foundRentals).toHaveProperty("links");
    expect(foundRentals.data).toHaveLength(0);
  });
});
