import { PrismaService } from "@modules/database/prisma";
import { Injectable } from "@nestjs/common";

import { CreateUserDTO } from "../dtos/create-user.dto";
import { UserWithPasswordDTO } from "../dtos/user-with-password.dto";
import { UserDTO } from "../dtos/user.dto";
import { IUsersRepository } from "../users-repository.interface";

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO): Promise<UserDTO> {
    const { password: _password, ...createdUser } =
      await this.prisma.user.create({ data });

    return createdUser;
  }

  async findById(id: string): Promise<UserDTO | null> {
    const { password: _password, ...existingUser } =
      await this.prisma.user.findUnique({ where: { id } });

    return existingUser;
  }

  async findByEmail(email: string): Promise<UserWithPasswordDTO | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return existingUser;
  }

  async findByUsername(username: string): Promise<UserWithPasswordDTO | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    return existingUser;
  }

  async update(data: UserWithPasswordDTO): Promise<void> {
    await this.prisma.user.update({
      where: { id: data.id },
      data: {
        ...data,
      },
    });
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      await this.prisma.user.deleteMany({});
    }
  }
}
