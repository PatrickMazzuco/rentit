import { RepositoryToken } from "@src/shared/container";
import { inject, injectable } from "tsyringe";

import { CategoryDTO } from "../../dtos/category.dto";
import { ICategoriesRepository } from "../../repositories/categories-repository.interface";
import { CreateCategoryDTO } from "./dtos/create-categoty.dto";

@injectable()
export class CreateCategoryService {
  constructor(
    @inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
  ) {}

  async execute(data: CreateCategoryDTO): Promise<CategoryDTO> {
    const existingCategory = await this.categoryRepository.findByName(
      data.name,
    );

    if (existingCategory) {
      throw new Error("Category already exists.");
    }

    const category = await this.categoryRepository.create(data);

    return category;
  }
}
