import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

import {
  startPasskeyRegistration,
  finishPasskeyRegistration,
  startPasskeyAuthentication,
  finishPasskeyAuthentication,
} from "../controllers/passkeyController";

const passkeyRouter = Router();

passkeyRouter.post(
  "/register/start",
  tokenAuthHandler,
  startPasskeyRegistration
);
passkeyRouter.post(
  "/register/finish",
  tokenAuthHandler,
  finishPasskeyRegistration
);

passkeyRouter.post(
  "/authenticate/start",
  startPasskeyAuthentication
);

passkeyRouter.post(
  "/authenticate/finish",
  finishPasskeyAuthentication
);

export default passkeyRouter;
