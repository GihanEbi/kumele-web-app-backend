import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import {
  createOrUpdateTermsCondition,
  getTermsAndConditions,
} from "../controllers/termsConditionController";

const termsCondRoutes = Router();

// create terms and condition
termsCondRoutes.post(
  "/create-update-terms-conditions",
  tokenAuthHandler,
  createOrUpdateTermsCondition
);

// get terms and conditions
termsCondRoutes.get(
  "/get-terms-conditions",
  tokenAuthHandler,
  getTermsAndConditions
);

export default termsCondRoutes;
