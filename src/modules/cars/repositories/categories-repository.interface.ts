import { CategoryDTO } from "./dtos/category.dto";
import { CreateCategoryDTO } from "./dtos/create-category.dto";

export interface ICategoriesRepository {
  create(data: CreateCategoryDTO): Promise<CategoryDTO>;
  findById(id: string): Promise<CategoryDTO | null>;
  findByName(name: string): Promise<CategoryDTO | null>;
}
