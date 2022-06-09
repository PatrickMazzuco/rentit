import { createMock } from "@golevelup/ts-jest";
import { CarDTO } from "@modules/cars/dtos/car.dto";
import { ICarsRepository } from "@modules/cars/repositories/cars-repository.interface";
import { CreateCarDTO } from "@modules/cars/use-cases/create-car/dtos/create-car.dto";
import { Provider } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";

import { getCategoryDTO } from "./categories.mock";

export const MockCarsRepository: ICarsRepository =
  createMock<ICarsRepository>();

export const MockCarsRepositoryProvider: Provider = {
  provide: RepositoryToken.CARS_REPOSITORY,
  useValue: MockCarsRepository,
};

export const getCarDTO = (): CarDTO => {
  const category = getCategoryDTO();

  return {
    id: uuidV4(),
    name: "Onix",
    description: "Onix car description",
    licensePlate: "ABC-1234",
    brand: "Chevrolet",
    dailyRate: 100,
    fineAmount: 10,
    available: true,
    categoryId: category.id,
    category,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getCreateCarDTO = (): CreateCarDTO => {
  const carDTO = getCarDTO();

  return {
    name: carDTO.name,
    description: carDTO.description,
    brand: carDTO.brand,
    licensePlate: carDTO.licensePlate,
    dailyRate: carDTO.dailyRate,
    fineAmount: carDTO.fineAmount,
    categoryId: carDTO.categoryId,
  };
};
