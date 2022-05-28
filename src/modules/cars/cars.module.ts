import { Module } from "@nestjs/common";
import { PrismaService } from "@src/modules/database/prisma";

import { DatabaseModule } from "../database/database.module";
import { CreateCategoryController } from "./use-cases/create-category/create-category.controller";
import { CreateCategoryService } from "./use-cases/create-category/create-category.service";
import { FindCategoryByIdController } from "./use-cases/find-category-by-id/find-category-by-id.controller";
import { FindCategoryByIdService } from "./use-cases/find-category-by-id/find-category-by-id.service";

@Module({
  imports: [DatabaseModule],
  controllers: [CreateCategoryController, FindCategoryByIdController],
  providers: [PrismaService, CreateCategoryService, FindCategoryByIdService],
  exports: [],
})
export class CarsModule {}
