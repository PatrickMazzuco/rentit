import { JwtAuthGuard } from "@modules/accounts/guards/jwt.guard";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

export function JWTAuthGuard() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}
