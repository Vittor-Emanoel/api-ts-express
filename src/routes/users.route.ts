import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import UsersRepository from "../repositories/users.repository";
import usersRepository from "../repositories/users.repository";

const secret = "sandash23h3i2hhnhnshaqejhn2";
const prisma = new PrismaClient();

const salt = 12;

const usersRouter = Router();

usersRouter.post("/", async (request, response) => {
  const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = userSchema.parse(request.body);

  try {
    const password_hash = await hash(password, salt);

    await usersRepository.create({
      name,
      email,
      password: password_hash,
    });

    return response.status(201);
  } catch (error) {
    return response.json({ error });
  }
});

usersRouter.post("/", async (request, response) => {
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = userSchema.parse(request.body);

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (user && user.password) {
      const comparePass = await compare(password, user.password);

      if (comparePass) {
        const payload = {
          name: user.name,
          email: user.email,
          role: user.role,
        };

        const token = jwt.sign(payload, secret, {
          expiresIn: "7d",
        });

        return response.json({ token });
      } else {
        return response.json({ error: "Invalid credentials" });
      }
    }
  } catch (error) {
    return response.json({ error: error });
  }
});

export default usersRouter;
