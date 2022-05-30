import { PrismaService } from "@modules/database/prisma";
import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { CreateCategoryController } from "./use-cases/create-category/create-category.controller";
import { CreateCategoryService } from "./use-cases/create-category/create-category.service";
import { FindCategoryByIdController } from "./use-cases/find-category-by-id/find-category-by-id.controller";
import { FindCategoryByIdService } from "./use-cases/find-category-by-id/find-category-by-id.service";
import { ListCategoriesController } from "./use-cases/list-categories/list-categories.controller";
import { ListCategoriesService } from "./use-cases/list-categories/list-categories.service";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateCategoryController,
    FindCategoryByIdController,
    ListCategoriesController,
  ],
  providers: [
    PrismaService,
    CreateCategoryService,
    FindCategoryByIdService,
    ListCategoriesService,
  ],
  exports: [],
})
export class CarsModule {}
