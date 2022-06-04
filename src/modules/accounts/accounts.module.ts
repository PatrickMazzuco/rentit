import { getJwtConfig } from "@config/jwt";
import { DatabaseModule } from "@modules/database/database.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import {
  BCryptPasswordHash,
  BCryptPasswordHashProvider,
} from "./providers/implementations/bcrypt-password-hash.provider";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthenticateController } from "./use-cases/authenticate-user/authenticate-user.controller";
import { AuthenticateUserService } from "./use-cases/authenticate-user/authenticate-user.service";
import { CreateUserController } from "./use-cases/create-user/create-user.controller";
import { CreateUserService } from "./use-cases/create-user/create-user.service";

@Module({
  imports: [DatabaseModule, PassportModule, JwtModule.register(getJwtConfig())],
  controllers: [CreateUserController, AuthenticateController],
  providers: [
    BCryptPasswordHash,
    BCryptPasswordHashProvider,
    JwtStrategy,
    CreateUserService,
    AuthenticateUserService,
  ],
})
export class AccountsModule {}
