import { CarError } from "@modules/cars/errors/car.errors";
import { SpecificationError } from "@modules/cars/errors/specification.errors";
import { ICarsRepository } from "@modules/cars/repositories/cars-repository.interface";
import { ISpecificationsRepository } from "@modules/cars/repositories/specifications-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";

import { AddCarSpecificationDTO } from "./dtos/add-car-specification.dto";

@Injectable()
export class AddCarSpecificationService {
  constructor(
    @Inject(RepositoryToken.SPECIFICATIONS_REPOSITORY)
    private readonly specificationRepository: ISpecificationsRepository,
    @Inject(RepositoryToken.CARS_REPOSITORY)
    private readonly carsRepository: ICarsRepository,
  ) {}

  async execute({
    id,
    specificationIds,
  }: AddCarSpecificationDTO): Promise<void> {
    const car = await this.carsRepository.findById(id);

    if (!car) {
      throw new CarError.NotFound();
    }

    const existingSpecifications = await this.specificationRepository.findByIds(
      specificationIds,
    );

    const specificationWasNotFound =
      existingSpecifications.length !== specificationIds.length;

    if (specificationWasNotFound) {
      const missingSpecificationIds = specificationIds.filter(
        (specificationId) =>
          !existingSpecifications.some((specification) => {
            return specification.id === specificationId;
          }),
      );

      throw new SpecificationError.MultipleNotFound(missingSpecificationIds);
    }

    const allSpecifications = [
      ...car.specifications,
      ...existingSpecifications,
    ];
    const specificationsById = allSpecifications.reduce(
      (acc, specification) => {
        acc[specification.id] = specification;
        return acc;
      },
      {},
    );

    car.specifications = Object.values(specificationsById);

    await this.carsRepository.update(car);
  }
}
