import { AuthError } from "@modules/accounts/errors/auth.errors";
import { RentalDTO } from "@modules/rentals/dtos/rental.dto";
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

import { ReturnRentedCarService } from "../return-rented-car.service";

describe("ReturnRentedCarService", () => {
  let returnRentedCarService: ReturnRentedCarService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReturnRentedCarService,
        MockCarsRepositoryProvider,
        MockRentalsRepositoryProvider,
      ],
    }).compile();

    returnRentedCarService = moduleRef.get<ReturnRentedCarService>(
      ReturnRentedCarService,
    );
  });

  it("should be able to return a rented car", async () => {
    const rental = getRentalDTO();

    jest.spyOn(MockRentalsRepository, "findById").mockResolvedValue(rental);

    jest.spyOn(MockRentalsRepository, "update").mockResolvedValue();

    jest.spyOn(MockCarsRepository, "update").mockResolvedValue();

    await expect(
      returnRentedCarService.execute({
        rentalId: rental.id,
        user: rental.user,
      }),
    ).resolves.not.toThrow();
  });

  it("should be able to return a rented car when overdue", async () => {
    const rental = getRentalDTO();

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

    jest
      .spyOn(MockRentalsRepository, "findById")
      .mockResolvedValue(updatedRental);

    jest.spyOn(MockRentalsRepository, "update").mockResolvedValue();

    jest.spyOn(MockCarsRepository, "update").mockResolvedValue();

    await expect(
      returnRentedCarService.execute({
        rentalId: rental.id,
        user: rental.user,
      }),
    ).resolves.not.toThrow();
  });

  it("should not be able to return an inexistent rental", async () => {
    const rental = getRentalDTO();

    jest.spyOn(MockRentalsRepository, "findById").mockResolvedValue(null);

    await expect(
      returnRentedCarService.execute({
        rentalId: rental.id,
        user: rental.user,
      }),
    ).rejects.toThrow(RentalError.NotFound);
  });

  it("should not be able to return a rental that was already returned", async () => {
    const rental = {
      ...getRentalDTO(),
      endDate: new Date(),
    };

    jest.spyOn(MockRentalsRepository, "findById").mockResolvedValue(rental);

    await expect(
      returnRentedCarService.execute({
        rentalId: rental.id,
        user: rental.user,
      }),
    ).rejects.toThrow(RentalError.AlreadyReturned);
  });

  it("should not be able to return a rental of another user", async () => {
    const rental = getRentalDTO();
    const loggedUser = {
      ...rental.user,
    };
    rental.user.id = "other-user-id";
    rental.userId = "other-user-id";

    jest.spyOn(MockRentalsRepository, "findById").mockResolvedValue(rental);

    await expect(
      returnRentedCarService.execute({
        rentalId: rental.id,
        user: loggedUser,
      }),
    ).rejects.toThrow(AuthError.NoPermission);
  });
});
