import { IntersectionType } from "@nestjs/swagger";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";

import { UpdateCategoryBodyDTO } from "./update-category-body.dto";

export class UpdateCategoryDTO extends IntersectionType(
  FindByIdDTO,
  UpdateCategoryBodyDTO,
) {}
