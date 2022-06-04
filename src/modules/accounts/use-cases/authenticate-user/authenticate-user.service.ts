import { AuthError } from "@modules/accounts/errors/auth.errors";
import { IPasswordHash } from "@modules/accounts/providers/password-hash.provider";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ProviderToken } from "@shared/provider-token.enum";
import { RepositoryToken } from "@shared/repository-tokens.enum";

import { AuthenticateUserBodyDTO } from "./dtos/authenticate-user-body.dto";
import { AuthenticateUserResponseDTO } from "./dtos/authenticate-user-response.dto";

@Injectable()
export class AuthenticateUserService {
  constructor(
    @Inject(RepositoryToken.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    @Inject(ProviderToken.PASSWORD_HASH)
    private readonly passwordHash: IPasswordHash,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    login,
    password,
  }: AuthenticateUserBodyDTO): Promise<AuthenticateUserResponseDTO> {
    let existingUser = await this.usersRepository.findByEmail(login);

    if (!existingUser) {
      existingUser = await this.usersRepository.findByUsername(login);
    }

    if (!existingUser) throw new AuthError.InvalidCredentials();

    const passwordMatches = await this.passwordHash.compare(
      password,
      existingUser.password,
    );

    if (!passwordMatches) {
      throw new AuthError.InvalidCredentials();
    }

    const accessToken = await this.jwtService.signAsync({
      sub: existingUser.id,
    });

    return {
      accessToken,
    };
  }
}
