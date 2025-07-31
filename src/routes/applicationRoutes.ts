import { Router } from "express";
import { createHobby, getHobbiesList } from "../controllers/applicationController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const applicationRouter = Router();


applicationRouter.post("/create-hobby", tokenAuthHandler, createHobby);
applicationRouter.get("/get-hobbies-list", tokenAuthHandler, getHobbiesList);

export default applicationRouter;
