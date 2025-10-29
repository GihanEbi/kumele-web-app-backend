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
  createAdvertLanguage,
  getAllAdvertLanguages,
  getAdvertLanguageById,
  updateAdvertLanguageById,
  createAdvertRegion,
  getAllAdvertRegions,
  getAdvertRegionById,
  updateAdvertRegionById,
  createAdvertDailyBudget,
  getAllAdvertDailyBudgets,
  getAdvertDailyBudgetById,
  updateAdvertDailyBudgetById,
  createAdvertCallToAction,
  getAllAdvertCallToActions,
  getAdvertCallToActionById,
  updateAdvertCallToActionById,
  getSavedAdvertsByUserId,
  createAdvertPlacementPrice,
  getAllAdvertPlacementPrices,
  getAdvertPlacementPriceById,
  updateAdvertPlacementPriceById,
  activateAdvertById,
  deactivateAdvertById,
} from "../controllers/advertController";

const advertRoute = Router();

advertRoute.post(
  "/create-advert-img",
  tokenAuthHandler,
  dynamicUpload.single("advert_image"),
  createAdvertImage
);
advertRoute.post(
  "/activate-advert-by-id/:advertId",
  tokenAuthHandler,
  activateAdvertById
);
advertRoute.post(
  "/deactivate-advert-by-id/:advertId",
  tokenAuthHandler,
  deactivateAdvertById
);
advertRoute.post("/create-advert", tokenAuthHandler, createAdvert);
advertRoute.get(
  "/get-saved-adverts-by-user-id",
  tokenAuthHandler,
  getSavedAdvertsByUserId
);
advertRoute.get("/get-all-adverts", tokenAuthHandler, getAllAdverts);
advertRoute.get("/get-advert-by-id/:advertId", tokenAuthHandler, getAdvertById);
advertRoute.get(
  "/get-adverts-by-category-id/:categoryId",
  tokenAuthHandler,
  getAdvertsByCategoryId
);
advertRoute.get(
  "/get-adverts-by-user-id",
  tokenAuthHandler,
  getAdvertsByUserId
);
advertRoute.put(
  "/update-advert-by-id/:advertId",
  tokenAuthHandler,
  updateAdvertById
);

// Advert Language Routes
advertRoute.post(
  "/create-advert-language",
  tokenAuthHandler,
  createAdvertLanguage
);
advertRoute.get(
  "/get-all-advert-languages",
  tokenAuthHandler,
  getAllAdvertLanguages
);
advertRoute.get(
  "/get-advert-language-by-id/:languageId",
  tokenAuthHandler,
  getAdvertLanguageById
);
advertRoute.put(
  "/update-advert-language-by-id/:languageId",
  tokenAuthHandler,
  updateAdvertLanguageById
);

// Advert Region Routes
advertRoute.post("/create-advert-region", tokenAuthHandler, createAdvertRegion);
advertRoute.get(
  "/get-all-advert-regions",
  tokenAuthHandler,
  getAllAdvertRegions
);
advertRoute.get(
  "/get-advert-region-by-id/:regionId",
  tokenAuthHandler,
  getAdvertRegionById
);
advertRoute.put(
  "/update-advert-region-by-id/:regionId",
  tokenAuthHandler,
  updateAdvertRegionById
);

// Advert Daily Budget Routes
advertRoute.post(
  "/create-advert-daily-budget",
  tokenAuthHandler,
  createAdvertDailyBudget
);
advertRoute.get(
  "/get-all-advert-daily-budgets",
  tokenAuthHandler,
  getAllAdvertDailyBudgets
);
advertRoute.get(
  "/get-advert-daily-budget-by-id/:budgetId",
  tokenAuthHandler,
  getAdvertDailyBudgetById
);
advertRoute.put(
  "/update-advert-daily-budget-by-id/:budgetId",
  tokenAuthHandler,
  updateAdvertDailyBudgetById
);

// Advert Call To Action Routes
advertRoute.post(
  "/create-advert-call-to-action",
  tokenAuthHandler,
  createAdvertCallToAction
);
advertRoute.get(
  "/get-all-advert-call-to-actions",
  tokenAuthHandler,
  getAllAdvertCallToActions
);
advertRoute.get(
  "/get-advert-call-to-action-by-id/:id",
  tokenAuthHandler,
  getAdvertCallToActionById
);
advertRoute.put(
  "/update-advert-call-to-action-by-id/:id",
  tokenAuthHandler,
  updateAdvertCallToActionById
);

// Advert Placement Price Routes
advertRoute.post(
  "/create-advert-placement-price",
  tokenAuthHandler,
  createAdvertPlacementPrice
);
advertRoute.get(
  "/get-all-advert-placement-prices",
  tokenAuthHandler,
  getAllAdvertPlacementPrices
);
advertRoute.get(
  "/get-advert-placement-price-by-id/:id",
  tokenAuthHandler,
  getAdvertPlacementPriceById
);
advertRoute.put(
  "/update-advert-placement-price-by-id/:id",
  tokenAuthHandler,
  updateAdvertPlacementPriceById
);

export default advertRoute;
