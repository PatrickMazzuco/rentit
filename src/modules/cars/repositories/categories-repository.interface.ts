import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryPaginationOptions } from "@shared/dtos/repository-pagination-options.dto";

import { CategorySortingFields } from "../enums/category-sorting-fields.enum";
import { CategoryDTO } from "./dtos/category.dto";
import { CreateCategoryDTO } from "./dtos/create-category.dto";

export interface ICategoriesRepository {
  create(data: CreateCategoryDTO): Promise<CategoryDTO>;
  findById(id: string): Promise<CategoryDTO | null>;
  findByName(name: string): Promise<CategoryDTO | null>;
  list(
    options: RepositoryPaginationOptions<CategorySortingFields>,
  ): Promise<ListAndCountDTO<CategoryDTO>>;
  truncate(): Promise<void>;
}
