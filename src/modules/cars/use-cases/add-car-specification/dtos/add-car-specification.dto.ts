import { IntersectionType } from "@nestjs/swagger";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";

import { AddCarSpecificationBodyDTO } from "./add-car-specification-body.dto";

export class AddCarSpecificationDTO extends IntersectionType(
  AddCarSpecificationBodyDTO,
  FindByIdDTO,
) {}
