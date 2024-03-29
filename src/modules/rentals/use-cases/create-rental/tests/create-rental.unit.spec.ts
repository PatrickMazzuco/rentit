import { CarError } from "@modules/cars/errors/car.errors";
import { RentalError } from "@modules/rentals/errors/rental-errors";
import { Test } from "@nestjs/testing";
import {
  MockCarsRepository,
  MockCarsRepositoryProvider,
} from "@utils/tests/mocks/cars";
import {
  getRentalDTO,
  MockRentalsRepository,
  MockRentalsRepositoryProvider,
} from "@utils/tests/mocks/rentals";

import { CreateRentalService } from "../create-rental.service";

describe("CreateRentalService", () => {
  let createRentalService: CreateRentalService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateRentalService,
        MockCarsRepositoryProvider,
        MockRentalsRepositoryProvider,
      ],
    }).compile();

    createRentalService =
      moduleRef.get<CreateRentalService>(CreateRentalService);
  });

  it("should be able to create a new rental", async () => {
    const rental = getRentalDTO();

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(rental.car);

    jest
      .spyOn(MockRentalsRepository, "findOneActiveByCarId")
      .mockResolvedValue(null);
    jest
      .spyOn(MockRentalsRepository, "findOneActiveByUserId")
      .mockResolvedValue(null);

    jest.spyOn(MockRentalsRepository, "create").mockResolvedValue(rental);

    await expect(
      createRentalService.execute({
        carId: rental.car.id,
        userId: rental.user.id,
        expectedReturnDate: rental.expectedReturnDate,
      }),
    ).resolves.not.toThrow();
  });

  it("should not be able to create a new rental for an inexistent car", async () => {
    const rental = getRentalDTO();

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(null);

    await expect(
      createRentalService.execute({
        carId: rental.car.id,
        userId: rental.user.id,
        expectedReturnDate: rental.expectedReturnDate,
      }),
    ).rejects.toThrow(CarError.NotFound);
  });

  it("should not be able to create a new rental with a short renting duration", async () => {
    const rental = getRentalDTO();

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(rental.car);

    jest
      .spyOn(MockRentalsRepository, "findOneActiveByCarId")
      .mockResolvedValue(null);
    jest
      .spyOn(MockRentalsRepository, "findOneActiveByUserId")
      .mockResolvedValue(null);

    await expect(
      createRentalService.execute({
        carId: rental.car.id,
        userId: rental.user.id,
        expectedReturnDate: new Date(),
      }),
    ).rejects.toThrow(RentalError.DurationTooLow);
  });

  it("should not be able to create a new rental for a car that is already being rented", async () => {
    const rental = getRentalDTO();

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(rental.car);

    jest
      .spyOn(MockRentalsRepository, "findOneActiveByCarId")
      .mockResolvedValue(rental);

    await expect(
      createRentalService.execute({
        carId: rental.car.id,
        userId: rental.user.id,
        expectedReturnDate: rental.expectedReturnDate,
      }),
    ).rejects.toThrow(RentalError.CarAlearyRented);
  });

  it("should not be able to create a new rental for a user that is already renting a car", async () => {
    const rental = getRentalDTO();

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(rental.car);

    jest
      .spyOn(MockRentalsRepository, "findOneActiveByCarId")
      .mockResolvedValue(null);
    jest
      .spyOn(MockRentalsRepository, "findOneActiveByUserId")
      .mockResolvedValue(rental);

    await expect(
      createRentalService.execute({
        carId: rental.car.id,
        userId: rental.user.id,
        expectedReturnDate: rental.expectedReturnDate,
      }),
    ).rejects.toThrow(RentalError.UserAlreadyRenting);
  });
});
