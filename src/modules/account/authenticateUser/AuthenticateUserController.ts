import { Request, Response } from "express";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

export class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      const authenticateUserUseCase = new AuthenticateUserUseCase();

      const result = await authenticateUserUseCase.execute({
        email,
        password,
      });

      return response.status(201).json(result);
    } catch (error) {
      return response.json(error);
    }
  }
}
