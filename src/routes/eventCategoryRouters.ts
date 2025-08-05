import { Router } from "express";
import { uploadEventCategoryIcon } from "../config/multerSvgConfig";
import { createEventCategory, getEventCategories } from "../controllers/eventCategoryController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const eventCategoryRouter = Router();

eventCategoryRouter.post(
  "/create-event-category",
  tokenAuthHandler,
  uploadEventCategoryIcon,
  createEventCategory
);
eventCategoryRouter.get("/get-event-categories", tokenAuthHandler, getEventCategories);

export default eventCategoryRouter;
