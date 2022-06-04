import { AuthError } from "@modules/accounts/errors/auth.errors";
import { Test } from "@nestjs/testing";
import {
  getCreateUserDTO,
  getUserDTO,
  MockJwtService,
  MockJwtServiceProvider,
  MockPasswordHash,
  MockPasswordHashProvider,
  MockUsersRepository,
  MockUsersRepositoryProvider,
} from "@utils/tests/mocks/accounts";

import { AuthenticateUserService } from "../authenticate-user.service";

describe("AuthenticateUserService", () => {
  let authenticateUserService: AuthenticateUserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticateUserService,
        MockUsersRepositoryProvider,
        MockPasswordHashProvider,
        MockJwtServiceProvider,
      ],
    }).compile();

    authenticateUserService = moduleRef.get<AuthenticateUserService>(
      AuthenticateUserService,
    );
  });

  it("should be able to authenticate with email and password", async () => {
    const user = getUserDTO();
    const authenticateUserData = getCreateUserDTO();
    const mockToken = "mock-token";

    jest.spyOn(MockUsersRepository, "findByEmail").mockResolvedValue(user);
    jest.spyOn(MockPasswordHash, "compare").mockResolvedValue(true);
    jest.spyOn(MockJwtService, "signAsync").mockResolvedValue(mockToken);

    const createdUser = await authenticateUserService.execute({
      login: authenticateUserData.email,
      password: authenticateUserData.password,
    });

    expect(createdUser).toHaveProperty("accessToken", mockToken);
  });

  it("should be able to authenticate with username and password", async () => {
    const user = getUserDTO();
    const authenticateUserData = getCreateUserDTO();
    const mockToken = "mock-token";

    jest.spyOn(MockUsersRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(MockUsersRepository, "findByUsername").mockResolvedValue(user);
    jest.spyOn(MockPasswordHash, "compare").mockResolvedValue(true);
    jest.spyOn(MockJwtService, "signAsync").mockResolvedValue(mockToken);

    const createdUser = await authenticateUserService.execute({
      login: authenticateUserData.username,
      password: authenticateUserData.password,
    });

    expect(createdUser).toHaveProperty("accessToken", mockToken);
  });

  it("should not be able to authenticate with inexistent username", async () => {
    const authenticateUserData = getCreateUserDTO();

    jest.spyOn(MockUsersRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(MockUsersRepository, "findByUsername").mockResolvedValue(null);

    await expect(
      authenticateUserService.execute({
        login: authenticateUserData.username,
        password: authenticateUserData.password,
      }),
    ).rejects.toThrow(AuthError.InvalidCredentials);
  });

  it("should not be able to authenticate with inexistent email", async () => {
    const authenticateUserData = getCreateUserDTO();

    jest.spyOn(MockUsersRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(MockUsersRepository, "findByUsername").mockResolvedValue(null);

    await expect(
      authenticateUserService.execute({
        login: authenticateUserData.email,
        password: authenticateUserData.password,
      }),
    ).rejects.toThrow(AuthError.InvalidCredentials);
  });

  it("should not be able to authenticate with inexistent email", async () => {
    const user = getUserDTO();
    const authenticateUserData = getCreateUserDTO();

    jest.spyOn(MockUsersRepository, "findByEmail").mockResolvedValue(user);
    jest.spyOn(MockUsersRepository, "findByUsername").mockResolvedValue(null);
    jest.spyOn(MockPasswordHash, "compare").mockResolvedValue(false);

    await expect(
      authenticateUserService.execute({
        login: authenticateUserData.email,
        password: authenticateUserData.password,
      }),
    ).rejects.toThrow(AuthError.InvalidCredentials);
  });
});
