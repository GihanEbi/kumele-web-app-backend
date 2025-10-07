import { Router } from "express";
import { uploadEventCategoryIcon } from "../config/multerSvgConfig";
import {
  createEventCategory,
  createIconImg,
  getEventCategories,
  updateEventCategory,
} from "../controllers/eventCategoryController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import { dynamicUpload } from "../config/multer.config";

const eventCategoryRouter = Router();

eventCategoryRouter.post(
  "/create-event-category",
  tokenAuthHandler,
  uploadEventCategoryIcon,
  createEventCategory
);
eventCategoryRouter.get(
  "/get-event-categories",
  tokenAuthHandler,
  getEventCategories
);

eventCategoryRouter.post(
  "/create-icon-img",
  tokenAuthHandler,
  dynamicUpload.single("icon_img_url"),
  createIconImg
);

eventCategoryRouter.put(
  "/update-event-category/:categoryId",
  tokenAuthHandler,
  uploadEventCategoryIcon,
  updateEventCategory
);

export default eventCategoryRouter;
