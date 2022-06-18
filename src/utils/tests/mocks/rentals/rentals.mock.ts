import { createMock } from "@golevelup/ts-jest";
import { RentalDTO } from "@modules/rentals/dtos/rental.dto";
import { IRentalsRepository } from "@modules/rentals/repositories/rentals-repository.interface";
import { CreateRentalDTO } from "@modules/rentals/use-cases/create-rental/dtos/create-rental.dto";
import { Provider } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";

import { getUserDTO } from "../accounts";
import { getCarDTO } from "../cars";

export const MockRentalsRepository: IRentalsRepository =
  createMock<IRentalsRepository>();

export const MockRentalsRepositoryProvider: Provider = {
  provide: RepositoryToken.RENTALS_REPOSITORY,
  useValue: MockRentalsRepository,
};

export const getRentalDTO = (): RentalDTO => {
  const car = getCarDTO();
  const user = getUserDTO();

  const expectedReturnDate = new Date();
  expectedReturnDate.setDate(expectedReturnDate.getDate() + 2);

  return {
    id: uuidV4(),
    startDate: new Date(),
    expectedReturnDate,
    carId: car.id,
    car,
    userId: user.id,
    user,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getCreateRentalDTO = (): CreateRentalDTO => {
  const rental = getRentalDTO();

  return {
    userId: rental.userId,
    carId: rental.carId,
    expectedReturnDate: rental.expectedReturnDate,
  };
};
