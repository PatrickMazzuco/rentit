import { UserDTO } from "@modules/accounts/dtos/user.dto";
import { UserError } from "@modules/accounts/errors/users.errors";
import { IPasswordHash } from "@modules/accounts/providers/password-hash.provider";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { ProviderToken } from "@shared/provider-token.enum";
import { RepositoryToken } from "@shared/repository-tokens.enum";

import { CreateUserDTO } from "./dtos/create-user.dto";

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(RepositoryToken.USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    @Inject(ProviderToken.PASSWORD_HASH)
    private readonly passwordHashService: IPasswordHash,
  ) {}

  async execute(data: CreateUserDTO): Promise<UserDTO> {
    let existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new UserError.AlreadyExists();
    }

    existingUser = await this.userRepository.findByUsername(data.username);

    if (existingUser) {
      throw new UserError.AlreadyExists();
    }

    const hashedPassword = await this.passwordHashService.hash(data.password);

    const createdUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return createdUser;
  }
}
