import { SpecificationDTO } from "@modules/cars/dtos/specification.dto";
import { PickType } from "@nestjs/swagger";

export class CreateSpecificationDTO extends PickType(SpecificationDTO, [
  "name",
  "description",
]) {}
