import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/repository-tokens.enum";

import { SpecificationError } from "../../errors/specification.errors";
import { ISpecificationsRepository } from "../../repositories/specifications-repository.interface";
import { UpdateSpecificationDTO } from "./dtos/update-specification.dto";

@Injectable()
export class UpdateSpecificationService {
  constructor(
    @Inject(RepositoryToken.SPECIFICATIONS_REPOSITORY)
    private readonly specificationRepository: ISpecificationsRepository,
  ) {}

  async execute({ id, ...data }: UpdateSpecificationDTO): Promise<void> {
    const existingSpecification = await this.specificationRepository.findById(
      id,
    );

    if (!existingSpecification) {
      throw new SpecificationError.NotFound();
    }

    const isUpdatingName = data.name !== undefined;

    if (isUpdatingName) {
      const existingSpecificationWithName =
        await this.specificationRepository.findByName(data.name);

      if (existingSpecificationWithName) {
        throw new SpecificationError.AlreadyExists();
      }
    }

    const updatedData = {
      ...existingSpecification,
      ...data,
    };

    await this.specificationRepository.update(updatedData);
  }
}
