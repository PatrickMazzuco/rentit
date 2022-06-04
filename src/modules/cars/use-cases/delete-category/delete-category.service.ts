import { Inject, Injectable } from "@nestjs/common";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";
import { RepositoryToken } from "@shared/repository-tokens.enum";

import { ICategoriesRepository } from "../../repositories/categories-repository.interface";

@Injectable()
export class DeleteCategoryService {
  constructor(
    @Inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoryRepository: ICategoriesRepository,
  ) {}

  async execute({ id }: FindByIdDTO): Promise<void> {
    const existingCategory = await this.categoryRepository.findById(id);

    if (existingCategory) {
      await this.categoryRepository.delete(existingCategory);
    }
  }
}
