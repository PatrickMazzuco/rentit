import { ApiProperty } from "@nestjs/swagger";

export class AuthenticateUserResponseDTO {
  @ApiProperty()
  accessToken: string;
}
