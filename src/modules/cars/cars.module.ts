import { Module } from "@nestjs/common";
import { PrismaService } from "@src/database/prisma";
import { CategoriesRepositoryProvider } from "@src/shared/providers/repositories.provider";

import { CreateCategoryController } from "./use-cases/create-category/create-category.controller";
import { CreateCategoryService } from "./use-cases/create-category/create-category.service";
import { FindCategoryByIdController } from "./use-cases/find-category-by-id/find-category-by-id.controller";
import { FindCategoryByIdService } from "./use-cases/find-category-by-id/find-category-by-id.service";

@Module({
  imports: [],
  controllers: [CreateCategoryController, FindCategoryByIdController],
  providers: [
    PrismaService,
    CategoriesRepositoryProvider,
    CreateCategoryService,
    FindCategoryByIdService,
  ],
  exports: [],
})
export class CarsModule {}
