import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/repository-tokens.enum";

import { CategoryError } from "../../errors/category.errors";
import { ICategoriesRepository } from "../../repositories/categories-repository.interface";
import { UpdateCategoryDTO } from "./dtos/update-category.dto";

@Injectable()
export class UpdateCategoryService {
  constructor(
    @Inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
  ) {}

  async execute({ id, ...data }: UpdateCategoryDTO): Promise<void> {
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new CategoryError.NotFound();
    }

    const isUpdatingName = data.name !== undefined;

    if (isUpdatingName) {
      const existingCategoryWithName = await this.categoryRepository.findByName(
        data.name,
      );

      if (existingCategoryWithName) {
        throw new CategoryError.AlreadyExists();
      }
    }

    const updatedData = {
      ...existingCategory,
      ...data,
    };

    await this.categoryRepository.update(updatedData);
  }
}
