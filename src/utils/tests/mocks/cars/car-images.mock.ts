import { createMock } from "@golevelup/ts-jest";
import { ICarImagesRepository } from "@modules/cars/repositories/car-images-repository.interface";
import { CarImageDTO } from "@modules/cars/repositories/dtos/car-image.dto";
import { Provider } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";

import { getCarDTO } from "./cars.mock";

export const MockCarImagesRepository: ICarImagesRepository =
  createMock<ICarImagesRepository>();

export const MockCarImagesRepositoryProvider: Provider = {
  provide: RepositoryToken.CAR_IMAGES_REPOSITORY,
  useValue: MockCarImagesRepository,
};

export const getCarImageDTO = (): CarImageDTO => {
  const car = getCarDTO();

  return {
    id: uuidV4(),
    image: "https://teja9.kuikr.com/images/car/default-cars.jpeg",
    description: "Default car image",
    carId: car.id,
    car,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// export const getCreateCarImageDTO = (): CreateCarImageDTO => {
//   const carImageDTO = getCarImageDTO();

//   return {
//     name: carImageDTO.name,
//     description: carImageDTO.description,
//     brand: carImageDTO.brand,
//     licensePlate: carImageDTO.licensePlate,
//     dailyRate: carImageDTO.dailyRate,
//     fineAmount: carImageDTO.fineAmount,
//     categoryId: carImageDTO.categoryId,
//   };
// };
