import { getJwtConfig } from "@config/jwt";
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UserDTO } from "../dtos/user.dto";
import { UserError } from "../errors/users.errors";
import { IUsersRepository } from "../repositories/users-repository.interface";

const { secret } = getJwtConfig();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(RepositoryToken.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserDTO> {
    const existingUser = await this.usersRepository.findById(payload.sub);

    if (!existingUser) {
      throw new UserError.Unauthorized();
    }

    return existingUser;
  }
}
