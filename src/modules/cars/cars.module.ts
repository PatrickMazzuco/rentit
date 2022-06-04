import { PrismaService } from "@modules/database/prisma";
import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { CreateCategoryController } from "./use-cases/create-category/create-category.controller";
import { CreateCategoryService } from "./use-cases/create-category/create-category.service";
import { DeleteCategoryController } from "./use-cases/delete-category/delete-category.controller";
import { DeleteCategoryService } from "./use-cases/delete-category/delete-category.service";
import { FindCategoryByIdController } from "./use-cases/find-category-by-id/find-category-by-id.controller";
import { FindCategoryByIdService } from "./use-cases/find-category-by-id/find-category-by-id.service";
import { ListCategoriesController } from "./use-cases/list-categories/list-categories.controller";
import { ListCategoriesService } from "./use-cases/list-categories/list-categories.service";
import { UpdateCategoryController } from "./use-cases/update-category/update-category.controller";
import { UpdateCategoryService } from "./use-cases/update-category/update-category.service";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateCategoryController,
    FindCategoryByIdController,
    ListCategoriesController,
    UpdateCategoryController,
    DeleteCategoryController,
  ],
  providers: [
    PrismaService,
    CreateCategoryService,
    FindCategoryByIdService,
    ListCategoriesService,
    UpdateCategoryService,
    DeleteCategoryService,
  ],
  exports: [],
})
export class CarsModule {}
