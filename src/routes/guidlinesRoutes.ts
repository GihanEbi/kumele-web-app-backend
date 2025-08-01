import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import { createGuidelines, getGuidelines } from "../controllers/guidelinesController";

const guidelinesRouter = Router();

// Route to create guidelines
guidelinesRouter.post("/create-update-guideline", tokenAuthHandler, createGuidelines);

// Route to get guidelines
guidelinesRouter.get("/get-guidelines", tokenAuthHandler, getGuidelines);

export default guidelinesRouter;
