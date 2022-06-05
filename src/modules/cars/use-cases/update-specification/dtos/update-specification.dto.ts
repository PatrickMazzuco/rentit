import { IntersectionType } from "@nestjs/swagger";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";

import { UpdateSpecificationBodyDTO } from "./update-specification-body.dto";

export class UpdateSpecificationDTO extends IntersectionType(
  FindByIdDTO,
  UpdateSpecificationBodyDTO,
) {}
