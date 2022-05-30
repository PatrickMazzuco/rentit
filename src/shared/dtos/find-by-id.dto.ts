import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty } from "class-validator";

export class FindByIdDTO {
  @IsUUID("4")
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}
