import { Module } from "@nestjs/common";

import { ClearDatabase } from "./clear-database";
import { PrismaService } from "./prisma";
import {
  CarImagesRepositoryProvider,
  CarsRepositoryProvider,
  CategoriesRepositoryProvider,
  SpecificationsRepositoryProvider,
  UsersRepositoryProvider,
} from "./providers/repositories.provider";

@Module({
  imports: [],
  providers: [
    PrismaService,
    ClearDatabase,
    CarsRepositoryProvider,
    CarImagesRepositoryProvider,
    CategoriesRepositoryProvider,
    SpecificationsRepositoryProvider,
    UsersRepositoryProvider,
  ],
  exports: [
    PrismaService,
    ClearDatabase,
    CarsRepositoryProvider,
    CarImagesRepositoryProvider,
    CategoriesRepositoryProvider,
    SpecificationsRepositoryProvider,
    UsersRepositoryProvider,
  ],
})
export class DatabaseModule {}
