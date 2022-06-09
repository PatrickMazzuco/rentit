import { IsAdmin } from "@modules/accounts/guards/admin.guard";
import { JwtAuthGuard } from "@modules/accounts/guards/jwt.guard";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

export function AdminJWTAuthGuard() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    UseGuards(IsAdmin),
  );
}
