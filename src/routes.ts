import { Router } from "express";
import { AuthenticateUserControler } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { EnsureAuthenticated } from "./controllers/middleware/EnsureAuthenticated";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController"
import { ProfileUserController } from "./controllers/ProfileUserController";


const router = Router();

router.post("/authenticate", new AuthenticateUserControler().handle)

router.post("/messages", EnsureAuthenticated, new CreateMessageController().handle)

router.get("/profile",EnsureAuthenticated, new ProfileUserController().handle)

router.get("/messages/last3", new GetLast3MessagesController().handle)
export { router }