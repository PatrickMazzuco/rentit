import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsString } from "class-validator";

export class UserDTO {
  @IsUUID("4")
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  driversLicense: string;

  @ApiProperty()
  isAdmin: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  avatar: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
