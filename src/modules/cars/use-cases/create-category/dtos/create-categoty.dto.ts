import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import { PickType } from "@nestjs/swagger";

export class CreateCategoryDTO extends PickType(CategoryDTO, [
  "name",
  "description",
]) {}
