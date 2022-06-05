import { Inject, Injectable } from "@nestjs/common";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";
import { RepositoryToken } from "@shared/repository-tokens.enum";

import { SpecificationDTO } from "../../dtos/specification.dto";
import { SpecificationError } from "../../errors/specification.errors";
import { ISpecificationsRepository } from "../../repositories/specifications-repository.interface";

@Injectable()
export class FindSpecificationByIdService {
  constructor(
    @Inject(RepositoryToken.SPECIFICATIONS_REPOSITORY)
    private readonly specificationRepository: ISpecificationsRepository,
  ) {}

  async execute({ id }: FindByIdDTO): Promise<SpecificationDTO> {
    const existingSpecification = await this.specificationRepository.findById(
      id,
    );

    if (!existingSpecification) {
      throw new SpecificationError.NotFound();
    }

    return existingSpecification;
  }
}
