import { Module } from "@nestjs/common";

import { ClearDatabase } from "./clear-database";
import { PrismaService } from "./prisma";
import {
  CategoriesRepositoryProvider,
  SpecificationsRepositoryProvider,
} from "./providers/repositories.provider";

@Module({
  imports: [],
  providers: [
    PrismaService,
    ClearDatabase,
    CategoriesRepositoryProvider,
    SpecificationsRepositoryProvider,
  ],
  exports: [
    PrismaService,
    ClearDatabase,
    CategoriesRepositoryProvider,
    SpecificationsRepositoryProvider,
  ],
})
export class DatabaseModule {}
