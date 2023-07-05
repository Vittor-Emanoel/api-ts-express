import { prisma } from "../../../database/lib/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface IAuthenticateUser {
  email: string;
  password: string;
}

export class AuthenticateUserUseCase {
  async execute({ email, password }: IAuthenticateUser) {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw Error("Email or Password Invalid!");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw Error("Email or Password Invalid!");
    }

    const token = sign({ email }, "072b34492c102e9dfa97a9e5f28cd6df", {
      subject: user.email,
      expiresIn: "1d",
    });

    return token;
  }
}
