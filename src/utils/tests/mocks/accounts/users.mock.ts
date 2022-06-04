import { createMock } from "@golevelup/ts-jest";
import { UserWithPasswordDTO } from "@modules/accounts/dtos/user-with-password.dto";
import { IPasswordHash } from "@modules/accounts/providers/password-hash.provider";
import { CreateUserDTO } from "@modules/accounts/repositories/dtos/create-user.dto";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { Provider } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ProviderToken } from "@shared/provider-token.enum";
import { RepositoryToken } from "@shared/repository-tokens.enum";
import { uuidV4 } from "@utils/misc/uuid";

export const MockUsersRepository: IUsersRepository =
  createMock<IUsersRepository>();

export const MockUsersRepositoryProvider: Provider = {
  provide: RepositoryToken.USERS_REPOSITORY,
  useValue: MockUsersRepository,
};

export const MockPasswordHash: IPasswordHash = createMock<IPasswordHash>();

export const MockPasswordHashProvider: Provider = {
  provide: ProviderToken.PASSWORD_HASH,
  useValue: MockPasswordHash,
};

export const MockJwtService = createMock<JwtService>();

export const MockJwtServiceProvider: Provider = {
  provide: JwtService,
  useValue: MockJwtService,
};

export const getUserDTO = (): UserWithPasswordDTO => {
  return {
    id: uuidV4(),
    name: "Quinn Patel",
    username: "silverleopard154",
    email: "quinn.patel@example.com",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    isAdmin: false,
    password: "password",
    driversLicense: "123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getCreateUserDTO = (): CreateUserDTO => {
  const userDTO = getUserDTO();

  return {
    name: userDTO.name,
    username: userDTO.username,
    email: userDTO.email,
    password: userDTO.password,
    driversLicense: userDTO.driversLicense,
    avatar: userDTO.avatar,
  };
};
