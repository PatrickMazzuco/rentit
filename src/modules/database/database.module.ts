import { Module } from "@nestjs/common";

import { ClearDatabase } from "./clear-database";
import { PrismaService } from "./prisma";
import { CategoriesRepositoryProvider } from "./providers/repositories.provider";

@Module({
  imports: [],
  providers: [PrismaService, ClearDatabase, CategoriesRepositoryProvider],
  exports: [PrismaService, ClearDatabase, CategoriesRepositoryProvider],
})
export class DatabaseModule {}
