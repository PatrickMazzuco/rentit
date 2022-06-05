import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";

import { UpdateUserAvatarDTO } from "./dtos/update-user-avatar.dto";

@Injectable()
export class UpdateUserAvatarService {
  constructor(
    @Inject(RepositoryToken.USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
  ) {}

  public async execute({ userId, avatar }: UpdateUserAvatarDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);

    user.avatar = avatar;

    await this.userRepository.update(user);
  }
}
