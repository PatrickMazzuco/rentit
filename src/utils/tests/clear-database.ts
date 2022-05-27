import { ICategoriesRepository } from "@src/modules/cars/repositories/categories-repository.interface";
import { RepositoryToken } from "@src/shared/container";
import { inject, injectable } from "tsyringe";

@injectable()
export class ClearDatabase {
  constructor(
    @inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(): Promise<void> {
    await this.categoriesRepository.truncate();
  }
}
