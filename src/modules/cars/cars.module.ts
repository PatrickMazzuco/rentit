import { PrismaService } from "@modules/database/prisma";
import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { CreateCategoryController } from "./use-cases/create-category/create-category.controller";
import { CreateCategoryService } from "./use-cases/create-category/create-category.service";
import { CreateSpecificationController } from "./use-cases/create-specification/create-specification.controller";
import { CreateSpecificationService } from "./use-cases/create-specification/create-specification.service";
import { DeleteCategoryController } from "./use-cases/delete-category/delete-category.controller";
import { DeleteCategoryService } from "./use-cases/delete-category/delete-category.service";
import { FindCategoryByIdController } from "./use-cases/find-category-by-id/find-category-by-id.controller";
import { FindCategoryByIdService } from "./use-cases/find-category-by-id/find-category-by-id.service";
import { FindSpecificationByIdController } from "./use-cases/find-specification-by-id/find-specification-by-id.controller";
import { FindSpecificationByIdService } from "./use-cases/find-specification-by-id/find-specification-by-id.service";
import { ListCategoriesController } from "./use-cases/list-categories/list-categories.controller";
import { ListCategoriesService } from "./use-cases/list-categories/list-categories.service";
import { ListSpecificationsController } from "./use-cases/list-specifications/list-specifications.controller";
import { ListSpecificationsService } from "./use-cases/list-specifications/list-specifications.service";
import { UpdateCategoryController } from "./use-cases/update-category/update-category.controller";
import { UpdateCategoryService } from "./use-cases/update-category/update-category.service";
import { UpdateSpecificationController } from "./use-cases/update-specification/update-specification.controller";
import { UpdateSpecificationService } from "./use-cases/update-specification/update-specification.service";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateCategoryController,
    FindCategoryByIdController,
    ListCategoriesController,
    UpdateCategoryController,
    DeleteCategoryController,
    CreateSpecificationController,
    FindSpecificationByIdController,
    ListSpecificationsController,
    UpdateSpecificationController,
  ],
  providers: [
    PrismaService,
    CreateCategoryService,
    FindCategoryByIdService,
    ListCategoriesService,
    UpdateCategoryService,
    DeleteCategoryService,
    CreateSpecificationService,
    FindSpecificationByIdService,
    ListSpecificationsService,
    UpdateSpecificationService,
  ],
  exports: [],
})
export class CarsModule {}
