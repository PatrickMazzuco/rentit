import { UserError } from "@modules/accounts/errors/users.errors";
import { Test } from "@nestjs/testing";
import {
  getCreateUserDTO,
  getUserDTO,
  MockPasswordHash,
  MockPasswordHashProvider,
  MockUsersRepository,
  MockUsersRepositoryProvider,
} from "@utils/tests/mocks/accounts";

import { CreateUserService } from "../create-user.service";

describe("CreateUserService", () => {
  let createUserService: CreateUserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserService,
        MockUsersRepositoryProvider,
        MockPasswordHashProvider,
      ],
    }).compile();

    createUserService = moduleRef.get<CreateUserService>(CreateUserService);
  });

  it("should be able to create a new user", async () => {
    const user = getUserDTO();
    const createUserData = getCreateUserDTO();
    const hashedPassword = "mock-password";

    jest.spyOn(MockUsersRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(MockUsersRepository, "findByUsername").mockResolvedValue(null);
    jest.spyOn(MockUsersRepository, "create").mockResolvedValue(user);
    jest.spyOn(MockPasswordHash, "hash").mockResolvedValue(hashedPassword);

    const createdUser = await createUserService.execute({
      ...createUserData,
    });

    expect(createdUser).toHaveProperty("id");
    expect(createdUser).toEqual(
      expect.objectContaining({
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: false,
        driversLicense: user.driversLicense,
      }),
    );
  });

  it("should not be able to create a user with duplicated email", async () => {
    const user = getUserDTO();
    const createUserData = getCreateUserDTO();

    jest.spyOn(MockUsersRepository, "findByEmail").mockResolvedValue(user);

    await expect(
      createUserService.execute({
        ...createUserData,
      }),
    ).rejects.toThrow(UserError.AlreadyExists);
  });

  it("should not be able to create a user with duplicated username", async () => {
    const user = getUserDTO();
    const createUserData = getCreateUserDTO();

    jest.spyOn(MockUsersRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(MockUsersRepository, "findByUsername").mockResolvedValue(user);

    await expect(
      createUserService.execute({
        ...createUserData,
      }),
    ).rejects.toThrow(UserError.AlreadyExists);
  });
});
