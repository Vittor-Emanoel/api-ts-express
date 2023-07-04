import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";
import User from "../models/user";

export class UsersRepository {
  async create(data: Prisma.UsersCreateInput) {
    const user = await prisma.users.create({
      data,
    });
    return user;
  }

  async findByName(name: string): Promise<User | null> {
    try {
      const user = await prisma.users.findUnique({
        where: {
          name: name,
        },
      });

      return user;
    } catch (error) {}
  }
}

export default new UsersRepository();
