import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import {
  addPurchaseToHistoryController,
  getAllPurchaseHistoryController,
  getPurchaseHistoryByUserIdController,
} from "../controllers/purchaseHistoryController";

const purchaseHistoryRoute = Router();

purchaseHistoryRoute.post(
  "/add",
  tokenAuthHandler,
  addPurchaseToHistoryController
);
purchaseHistoryRoute.get(
  "/user",
  tokenAuthHandler,
  getPurchaseHistoryByUserIdController
);
purchaseHistoryRoute.get(
  "/all",
  tokenAuthHandler,
  getAllPurchaseHistoryController
);

export default purchaseHistoryRoute;
