import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { ICarImagesRepository } from "@modules/cars/repositories/car-images-repository.interface";
import { ICarsRepository } from "@modules/cars/repositories/cars-repository.interface";
import { ICategoriesRepository } from "@modules/cars/repositories/categories-repository.interface";
import { ISpecificationsRepository } from "@modules/cars/repositories/specifications-repository.interface";
import { IRentalsRepository } from "@modules/rentals/repositories/rentals-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";

@Injectable()
export class ClearDatabase {
  constructor(
    @Inject(RepositoryToken.CARS_REPOSITORY)
    private readonly carsRepository: ICarsRepository,
    @Inject(RepositoryToken.CAR_IMAGES_REPOSITORY)
    private readonly carImagesRepository: ICarImagesRepository,
    @Inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: ICategoriesRepository,
    @Inject(RepositoryToken.SPECIFICATIONS_REPOSITORY)
    private readonly specificationsRepository: ISpecificationsRepository,
    @Inject(RepositoryToken.RENTALS_REPOSITORY)
    private readonly rentalsRepository: IRentalsRepository,
    @Inject(RepositoryToken.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<void> {
    await this.rentalsRepository.truncate();
    await this.categoriesRepository.truncate();
    await this.specificationsRepository.truncate();
    await this.carImagesRepository.truncate();
    await this.carsRepository.truncate();
    await this.usersRepository.truncate();
  }
}
