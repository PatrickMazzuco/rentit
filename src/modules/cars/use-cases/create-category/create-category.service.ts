import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/repository-tokens.enum";

import { CategoryDTO } from "../../dtos/category.dto";
import { CategoryError } from "../../errors/category.errors";
import { ICategoriesRepository } from "../../repositories/categories-repository.interface";
import { CreateCategoryDTO } from "./dtos/create-categoty.dto";

@Injectable()
export class CreateCategoryService {
  constructor(
    @Inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
  ) {}

  async execute(data: CreateCategoryDTO): Promise<CategoryDTO> {
    const existingCategory = await this.categoryRepository.findByName(
      data.name,
    );

    if (existingCategory) {
      throw new CategoryError.AlreadyExists();
    }

    const category = await this.categoryRepository.create(data);

    return category;
  }
}
