import { ICategoriesRepository } from "@modules/cars/repositories/categories-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/repository-tokens.enum";

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
