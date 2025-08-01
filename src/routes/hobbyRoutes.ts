import { Router } from "express";
import { uploadHobbyIcon } from "../config/multerSvgConfig";
import { createHobby, getHobbies } from "../controllers/hobbyController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const hobbyRouter = Router();

hobbyRouter.post(
  "/create-hobby",
  tokenAuthHandler,
  uploadHobbyIcon,
  createHobby
);
hobbyRouter.get("/get-hobbies-list", tokenAuthHandler, getHobbies);

export default hobbyRouter;
