import { Inject, Injectable } from "@nestjs/common";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";
import { RepositoryToken } from "@shared/repository-tokens.enum";

import { ISpecificationsRepository } from "../../repositories/specifications-repository.interface";

@Injectable()
export class DeleteSpecificationService {
  constructor(
    @Inject(RepositoryToken.SPECIFICATIONS_REPOSITORY)
    private readonly specificationRepository: ISpecificationsRepository,
  ) {}

  async execute({ id }: FindByIdDTO): Promise<void> {
    const existingSpecification = await this.specificationRepository.findById(
      id,
    );

    if (existingSpecification) {
      await this.specificationRepository.delete(existingSpecification);
    }
  }
}
