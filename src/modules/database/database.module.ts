import { Module } from "@nestjs/common";

import { ClearDatabase } from "./clear-database";
import { PrismaService } from "./prisma";
import {
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
    CategoriesRepositoryProvider,
    SpecificationsRepositoryProvider,
    UsersRepositoryProvider,
  ],
  exports: [
    PrismaService,
    ClearDatabase,
    CarsRepositoryProvider,
    CategoriesRepositoryProvider,
    SpecificationsRepositoryProvider,
    UsersRepositoryProvider,
  ],
})
export class DatabaseModule {}
