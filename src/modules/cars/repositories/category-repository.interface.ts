import { CategoryDTO } from "./dtos/category.dto";
import { CreateCategoryDTO } from "./dtos/create-category.dto";

export interface ICategoryRepository {
  create(data: CreateCategoryDTO): Promise<CategoryDTO>;
}
