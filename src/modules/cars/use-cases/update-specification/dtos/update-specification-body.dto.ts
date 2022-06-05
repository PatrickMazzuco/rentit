import { SpecificationDTO } from "@modules/cars/dtos/specification.dto";
import { PickType } from "@nestjs/swagger";

export class UpdateSpecificationBodyDTO extends PickType(SpecificationDTO, [
  "name",
  "description",
]) {}
