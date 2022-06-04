import { createMock } from "@golevelup/ts-jest";
import { SpecificationDTO } from "@modules/cars/dtos/specification.dto";
import { ISpecificationsRepository } from "@modules/cars/repositories/specifications-repository.interface";
import { CreateSpecificationDTO } from "@modules/cars/use-cases/create-specification/dtos/create-specification.dto";
import { Provider } from "@nestjs/common";
import { RepositoryToken } from "@shared/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";

export const MockSpecificationsRepository: ISpecificationsRepository =
  createMock<ISpecificationsRepository>();

export const MockSpecificationsRepositoryProvider: Provider = {
  provide: RepositoryToken.SPECIFICATIONS_REPOSITORY,
  useValue: MockSpecificationsRepository,
};

export const getSpecificationDTO = (): SpecificationDTO => {
  return {
    id: uuidV4(),
    name: "Specification name",
    description: "Descrição da especificação",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getCreateSpecificationDTO = (): CreateSpecificationDTO => {
  const specificationDTO = getSpecificationDTO();

  return {
    description: specificationDTO.description,
    name: specificationDTO.name,
  };
};
