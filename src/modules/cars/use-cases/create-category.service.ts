import { CategoryDTO } from "../dtos/category.dto";
import { ICategoryRepository } from "../repositories/category-repository.interface";
import { CreateCategoryDTO } from "./dtos/create-categoty.dto";

export class CreateCategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(data: CreateCategoryDTO): Promise<CategoryDTO> {
    const category = await this.categoryRepository.create(data);

    return category;
  }
}
