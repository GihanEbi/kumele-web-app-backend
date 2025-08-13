import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

// Import the new dynamic uploader
import { dynamicUpload } from "../config/multer.config";

import {
  createAdvertImage,
  createAdvert,
  getAdvertById,
  getAdvertsByCategoryId,
  getAdvertsByUserId,
  getAllAdverts,
  updateAdvertById,
} from "../controllers/advertController";

const advertRoute = Router();

advertRoute.post(
  "/create-advert-img",
  tokenAuthHandler,
  dynamicUpload.single("advert_image"),
  createAdvertImage
);
advertRoute.post("/create-advert", tokenAuthHandler, createAdvert);
advertRoute.get("/get-all-adverts", tokenAuthHandler, getAllAdverts);
advertRoute.get("/get-advert-by-id/:advertId", tokenAuthHandler, getAdvertById);
advertRoute.get(
  "/get-adverts-by-category-id/:categoryId",
  tokenAuthHandler,
  getAdvertsByCategoryId
);
advertRoute.get(
  "/get-adverts-by-user-id/:userId",
  tokenAuthHandler,
  getAdvertsByUserId
);
advertRoute.put(
  "/update-advert-by-id/:advertId",
  tokenAuthHandler,
  updateAdvertById
);

export default advertRoute;
