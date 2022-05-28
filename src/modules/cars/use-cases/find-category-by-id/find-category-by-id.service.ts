import { Inject, Injectable } from "@nestjs/common";
import { FindByIdDTO } from "@src/shared/dtos/find-by-id.dto";
import { RepositoryToken } from "@src/shared/repository-tokens.enum";

import { CategoryDTO } from "../../dtos/category.dto";
import { CategoryError } from "../../errors/category.errors";
import { ICategoriesRepository } from "../../repositories/categories-repository.interface";

@Injectable()
export class FindCategoryByIdService {
  constructor(
    @Inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
  ) {}

  async execute({ id }: FindByIdDTO): Promise<CategoryDTO> {
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new CategoryError.NotFound();
    }

    return existingCategory;
  }
}
