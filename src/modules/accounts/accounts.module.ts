import { getJwtConfig } from "@config/jwt";
import { DatabaseModule } from "@modules/database/database.module";
import { FilesModule } from "@modules/files/files.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { BCryptPasswordHashProvider } from "./providers/implementations/bcrypt-password-hash.provider";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthenticateController } from "./use-cases/authenticate-user/authenticate-user.controller";
import { AuthenticateUserService } from "./use-cases/authenticate-user/authenticate-user.service";
import { CreateUserController } from "./use-cases/create-user/create-user.controller";
import { CreateUserService } from "./use-cases/create-user/create-user.service";
import { UpdateUserAvatarController } from "./use-cases/update-user-avatar/update-user-avatar.controller";
import { UpdateUserAvatarService } from "./use-cases/update-user-avatar/update-user-avatar.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.register(getJwtConfig()),
    DatabaseModule,
    FilesModule,
  ],
  controllers: [
    CreateUserController,
    AuthenticateController,
    UpdateUserAvatarController,
  ],
  providers: [
    BCryptPasswordHashProvider,
    JwtStrategy,
    CreateUserService,
    AuthenticateUserService,
    UpdateUserAvatarService,
  ],
  exports: [JwtStrategy],
})
export class AccountsModule {}
