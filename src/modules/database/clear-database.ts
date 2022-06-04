import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { ICategoriesRepository } from "@modules/cars/repositories/categories-repository.interface";
import { ISpecificationsRepository } from "@modules/cars/repositories/specifications-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/repository-tokens.enum";

@Injectable()
export class ClearDatabase {
  constructor(
    @Inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: ICategoriesRepository,
    @Inject(RepositoryToken.SPECIFICATIONS_REPOSITORY)
    private readonly specificationsRepository: ISpecificationsRepository,
    @Inject(RepositoryToken.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<void> {
    await this.categoriesRepository.truncate();
    await this.specificationsRepository.truncate();
    await this.usersRepository.truncate();
  }
}
