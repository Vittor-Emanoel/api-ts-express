import { prisma } from "../../database/lib/prisma";
import { IUsersRepository } from "../IUserSRepository";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class UserRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<User> {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    return user as User;
  }

  async save(User: User): Promise<void> {
    await prisma.users.create({
      data: User,
    });
  }
}
