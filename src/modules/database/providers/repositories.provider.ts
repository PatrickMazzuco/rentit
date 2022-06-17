import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/prisma-users.repository";
import { PrismaCarImagesRepository } from "@modules/cars/repositories/prisma/prisma-car-images.repository";
import { PrismaCarsRepository } from "@modules/cars/repositories/prisma/prisma-cars.repository";
import { PrismaCategoriesRepository } from "@modules/cars/repositories/prisma/prisma-categories.repository";
import { PrismaSpecificationsRepository } from "@modules/cars/repositories/prisma/prisma-specifications.repository";
import { PrismaRentalsRepository } from "@modules/cars/repositories/prisma/rentals.repository";
import { Provider } from "@nestjs/common";

import { RepositoryToken } from "../../../shared/enums/repository-tokens.enum";

export const CarsRepositoryProvider: Provider = {
  provide: RepositoryToken.CARS_REPOSITORY,
  useClass: PrismaCarsRepository,
};

export const CarImagesRepositoryProvider: Provider = {
  provide: RepositoryToken.CAR_IMAGES_REPOSITORY,
  useClass: PrismaCarImagesRepository,
};

export const CategoriesRepositoryProvider: Provider = {
  provide: RepositoryToken.CATEGORIES_REPOSITORY,
  useClass: PrismaCategoriesRepository,
};

export const SpecificationsRepositoryProvider: Provider = {
  provide: RepositoryToken.SPECIFICATIONS_REPOSITORY,
  useClass: PrismaSpecificationsRepository,
};

export const RentalsRepositoryProvider: Provider = {
  provide: RepositoryToken.RENTALS_REPOSITORY,
  useClass: PrismaRentalsRepository,
};

export const UsersRepositoryProvider: Provider = {
  provide: RepositoryToken.USERS_REPOSITORY,
  useClass: PrismaUsersRepository,
};
