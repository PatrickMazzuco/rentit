import { Inject, Injectable } from "@nestjs/common";
import { ICategoriesRepository } from "@src/modules/cars/repositories/categories-repository.interface";
import { RepositoryToken } from "@src/shared/repository-tokens.enum";

@Injectable()
export class ClearDatabase {
  constructor(
    @Inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(): Promise<void> {
    await this.categoriesRepository.truncate();
  }
}
