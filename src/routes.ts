import { Router } from "express";
import { CreateUserController } from "./modules/users/useCases/createUser/CreateUserController";
import { AuthenticateUserController } from "./modules/account/authenticateUser/AuthenticateUserController";

const routes = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

routes.post("/register", createUserController.handle);
routes.post("/login", authenticateUserController.handle);

export default routes;
