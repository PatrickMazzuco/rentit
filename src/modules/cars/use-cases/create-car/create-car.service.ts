import { CarDTO } from "@modules/cars/dtos/car.dto";
import { CarError } from "@modules/cars/errors/car.errors";
import { CategoryError } from "@modules/cars/errors/category.errors";
import { ICarsRepository } from "@modules/cars/repositories/cars-repository.interface";
import { ICategoriesRepository } from "@modules/cars/repositories/categories-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";

import { CreateCarDTO } from "./dtos/create-car.dto";

@Injectable()
export class CreateCarService {
  constructor(
    @Inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: ICategoriesRepository,
    @Inject(RepositoryToken.CARS_REPOSITORY)
    private readonly carsRepository: ICarsRepository,
  ) {}

  async execute(data: CreateCarDTO): Promise<CarDTO> {
    if (data.categoryId) {
      const category = await this.categoriesRepository.findById(
        data.categoryId,
      );

      if (!category) {
        throw new CategoryError.NotFound();
      }
    }

    const existingCar = await this.carsRepository.findByLicensePlate(
      data.licensePlate,
    );

    if (existingCar) {
      throw new CarError.AlreadyExists();
    }

    const createdCar = await this.carsRepository.create({
      ...data,
      available: true,
    });

    return createdCar;
  }
}
