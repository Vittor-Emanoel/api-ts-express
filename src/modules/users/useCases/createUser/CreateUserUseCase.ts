import { prisma } from "../../../../database/lib/prisma";
import { hash } from "bcryptjs";

interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  async execute({ name, email, password }: ICreateUser) {
    //validar se já existe um e-mail
    const userExist = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new Error("User already exists");
    }

    //Criptografar a senha

    const hashPassword = await hash(password, 12);

    //Salvar o usuário

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    return user;
  }
}
