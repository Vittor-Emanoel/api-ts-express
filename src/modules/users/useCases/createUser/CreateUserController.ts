import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";

export class CreateUserController {
  async handle(request: Request, response: Response) {
    try {
      const { name, email, password } = request.body;

      const createUserUseCase = new CreateUserUseCase();

      const result = await createUserUseCase.execute({
        name,
        email,
        password,
      });

      return response.status(201).json(result);
    } catch (error) {
      return response.json(error);
    }
  }
}
