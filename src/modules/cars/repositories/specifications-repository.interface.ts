import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryPaginationOptions } from "@shared/dtos/repository-pagination-options.dto";

import { SpecificationDTO } from "../dtos/specification.dto";
import { SpecificationSortingFields } from "../enums/specification-sorting-fields.enum";
import { CreateSpecificationDTO } from "./dtos/create-specification.dto";

export interface ISpecificationsRepository {
  create(data: CreateSpecificationDTO): Promise<SpecificationDTO>;
  findById(id: string): Promise<SpecificationDTO | null>;
  findByName(name: string): Promise<SpecificationDTO | null>;
  list(
    options: RepositoryPaginationOptions<SpecificationSortingFields>,
  ): Promise<ListAndCountDTO<SpecificationDTO>>;
  update(data: SpecificationDTO): Promise<void>;
  delete(data: SpecificationDTO): Promise<void>;
  truncate(): Promise<void>;
}
