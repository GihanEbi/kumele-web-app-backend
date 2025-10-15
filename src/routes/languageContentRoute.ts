import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

import { getProfilePageContents } from "../controllers/languageContentController";
const languageContentRoute = Router();

languageContentRoute.get(
  "/get-profile-page-contents",
  tokenAuthHandler,
  getProfilePageContents
);

export default languageContentRoute;
