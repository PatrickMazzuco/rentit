import { Module } from "@nestjs/common";

import { ClearDatabase } from "./clear-database";
import { PrismaService } from "./prisma";
import {
  CategoriesRepositoryProvider,
  SpecificationsRepositoryProvider,
  UsersRepositoryProvider,
} from "./providers/repositories.provider";

@Module({
  imports: [],
  providers: [
    PrismaService,
    ClearDatabase,
    CategoriesRepositoryProvider,
    SpecificationsRepositoryProvider,
    UsersRepositoryProvider,
  ],
  exports: [
    PrismaService,
    ClearDatabase,
    CategoriesRepositoryProvider,
    SpecificationsRepositoryProvider,
    UsersRepositoryProvider,
  ],
})
export class DatabaseModule {}
