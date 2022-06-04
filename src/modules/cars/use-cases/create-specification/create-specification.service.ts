import { SpecificationDTO } from "@modules/cars/dtos/specification.dto";
import { SpecificationError } from "@modules/cars/errors/specification.errors";
import { ISpecificationsRepository } from "@modules/cars/repositories/specifications-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/repository-tokens.enum";

import { CreateSpecificationDTO } from "./dtos/create-specification.dto";

@Injectable()
export class CreateSpecificationService {
  constructor(
    @Inject(RepositoryToken.SPECIFICATIONS_REPOSITORY)
    private readonly specificationRepository: ISpecificationsRepository,
  ) {}

  async execute(data: CreateSpecificationDTO): Promise<SpecificationDTO> {
    const existingSpecification = await this.specificationRepository.findByName(
      data.name,
    );

    if (existingSpecification) {
      throw new SpecificationError.AlreadyExists();
    }

    const specification = await this.specificationRepository.create(data);

    return specification;
  }
}
