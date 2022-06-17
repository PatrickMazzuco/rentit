import { AccountsModule } from "@modules/accounts/accounts.module";
import { PrismaService } from "@modules/database/prisma";
import { FilesModule } from "@modules/files/files.module";
import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { AddCarSpecificationController } from "./use-cases/add-car-specification/add-car-specification.controller";
import { AddCarSpecificationService } from "./use-cases/add-car-specification/add-car-specification.service";
import { CreateCarImagesController } from "./use-cases/create-car-images/create-car-images.controller";
import { CreateCarImagesService } from "./use-cases/create-car-images/create-car-images.service";
import { CreateCarController } from "./use-cases/create-car/create-car.controller";
import { CreateCarService } from "./use-cases/create-car/create-car.service";
import { CreateCategoryController } from "./use-cases/create-category/create-category.controller";
import { CreateCategoryService } from "./use-cases/create-category/create-category.service";
import { CreateRentalController } from "./use-cases/create-rental/create-rental.controller";
import { CreateRentalService } from "./use-cases/create-rental/create-rental.service";
import { CreateSpecificationController } from "./use-cases/create-specification/create-specification.controller";
import { CreateSpecificationService } from "./use-cases/create-specification/create-specification.service";
import { DeleteCategoryController } from "./use-cases/delete-category/delete-category.controller";
import { DeleteCategoryService } from "./use-cases/delete-category/delete-category.service";
import { DeleteSpecificationController } from "./use-cases/delete-specification/delete-specification.controller";
import { DeleteSpecificationService } from "./use-cases/delete-specification/delete-specification.service";
import { FindCategoryByIdController } from "./use-cases/find-category-by-id/find-category-by-id.controller";
import { FindCategoryByIdService } from "./use-cases/find-category-by-id/find-category-by-id.service";
import { FindSpecificationByIdController } from "./use-cases/find-specification-by-id/find-specification-by-id.controller";
import { FindSpecificationByIdService } from "./use-cases/find-specification-by-id/find-specification-by-id.service";
import { ListCarsController } from "./use-cases/list-cars/list-cars.controller";
import { ListCarsService } from "./use-cases/list-cars/list-cars.service";
import { ListCategoriesController } from "./use-cases/list-categories/list-categories.controller";
import { ListCategoriesService } from "./use-cases/list-categories/list-categories.service";
import { ListSpecificationsController } from "./use-cases/list-specifications/list-specifications.controller";
import { ListSpecificationsService } from "./use-cases/list-specifications/list-specifications.service";
import { UpdateCategoryController } from "./use-cases/update-category/update-category.controller";
import { UpdateCategoryService } from "./use-cases/update-category/update-category.service";
import { UpdateSpecificationController } from "./use-cases/update-specification/update-specification.controller";
import { UpdateSpecificationService } from "./use-cases/update-specification/update-specification.service";

@Module({
  imports: [DatabaseModule, AccountsModule, FilesModule],
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
    DeleteSpecificationController,
    CreateCarController,
    ListCarsController,
    AddCarSpecificationController,
    CreateCarImagesController,
    CreateRentalController,
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
    DeleteSpecificationService,
    CreateCarService,
    ListCarsService,
    AddCarSpecificationService,
    CreateCarImagesService,
    CreateRentalService,
  ],
  exports: [],
})
export class CarsModule {}
