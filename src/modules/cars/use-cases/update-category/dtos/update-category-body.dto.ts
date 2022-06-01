import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import { PickType } from "@nestjs/swagger";

export class UpdateCategoryBodyDTO extends PickType(CategoryDTO, [
  "name",
  "description",
]) {}
