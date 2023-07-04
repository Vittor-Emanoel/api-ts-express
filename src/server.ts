import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import router from "./routes";

const prisma = new PrismaClient();

const secret = "sandash23h3i2hhnhnshaqejhn2";
const salt = 12;

const app = express();
app.use(express.json());
app.use(router);

interface AuthenticatedRequest extends Request {
  user?: any; //
}

//middleware
function authenticateToken(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return response.sendStatus(401);
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return response.sendStatus(403);
    }
    request.user = user;
    next();
  });
}

// app.post("/register", async (request, response) => {
//   const userSchema = z.object({
//     name: z.string().min(3),
//     email: z.string().email(),
//     password: z.string().min(6),
//   });

//   const { name, email, password } = userSchema.parse(request.body);

//   try {
//     const password_hash = await hash(password, salt);

//     await prisma.users.create({
//       data: {
//         name,
//         email,
//         password: password_hash,
//       },
//     });

//     return response.status(201);
//   } catch (error) {
//     return response.json({ error });
//   }
// });

app.post("/login", async (request, response) => {
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

app.post("/members", async (request, response) => {
  const { name, phone, congregations_Id } = request.body;

  try {
    const member = await prisma.members.create({
      data: {
        name,
        phone,
        congregations_Id,
      },
    });

    return response.status(201).json(member);
  } catch (error) {
    return response.status(400).json(error);
  }
});

app.post("/congregations", async (request, response) => {
  const { name, shepherd } = request.body;

  try {
    const congregation = await prisma.congregations.create({
      data: {
        name,
        shepherd,
      },
    });

    return response.status(201).json(congregation);
  } catch (error) {
    return response.status(400).json(error);
  }
});

app.get("/members", async (request, response) => {
  const members = await prisma.members.findMany({
    select: {
      id: true,
      name: true,
      phone: true,
      congregation: true,
    },
  });

  return response.json(members);
});

app.get("/congregations", async (request, response) => {
  const congregations = await prisma.congregations.findMany();

  return response.json(congregations);
});

app.listen(3333);
