import { CategoryDTO } from "../../dtos/category.dto";
import { ICategoriesRepository } from "../../repositories/categories-repository.interface";
import { CreateCategoryDTO } from "./dtos/create-categoty.dto";

export class CreateCategoryService {
  constructor(private readonly categoryRepository: ICategoriesRepository) {}

  async execute(data: CreateCategoryDTO): Promise<CategoryDTO> {
    const category = await this.categoryRepository.create(data);

    return category;
  }
}
