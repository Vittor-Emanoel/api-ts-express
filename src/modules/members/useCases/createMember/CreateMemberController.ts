import { Request, Response } from "express";
import { CreateMemberUseCase } from "./CreateMemberUseCase";

export class CreateMemberController {
  async handle(request: Request, response: Response) {
    try {
      const { name, phone, congregation_Id } = request.body;

      const createMemberUseCase = new CreateMemberUseCase();

      await createMemberUseCase.execute({
        name,
        phone,
        congregation_Id,
      });

      return response.status(201).send();
    } catch (error) {
      console.log(error);
    }
  }
}
