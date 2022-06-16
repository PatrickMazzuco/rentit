import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray } from "class-validator";

export class AddCarSpecificationBodyDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({ type: String, isArray: true })
  specificationIds: string[];
}
