import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import {
  createLandingPageDetails,
  creteLandingPageLinks,
  getLandingPageDetails,
  getLandingPageDetailsById,
  getLandingPageLinks,
  updateLandingPageDetails,
} from "../controllers/landingPageController";
import { createAboutUs, getAboutUs } from "../controllers/aboutUsController";
import { dynamicUpload } from "../config/multer.config";
import { getAllLandingPageDetailsService } from "../models/landingPageModel";

const landingPageRouter = Router();
// Route to create or update landing page links
landingPageRouter.post(
  "/create-landing-page-links",
  tokenAuthHandler,
  creteLandingPageLinks
);

// Route to get landing page links
landingPageRouter.get(
  "/get-landing-page-links",
  tokenAuthHandler,
  getLandingPageLinks
);

// create about us
landingPageRouter.post("/create-about-us", tokenAuthHandler, createAboutUs);

// Route to get about us
landingPageRouter.get("/get-about-us", tokenAuthHandler, getAboutUs);

// Route to create landing page details
landingPageRouter.post(
  "/create-landing-page-details",
  tokenAuthHandler,
  dynamicUpload.single("backgroundImage"),
  createLandingPageDetails
);
// Route to get landing page details by ID
landingPageRouter.get(
  "/get-landing-page-details/:id",
  tokenAuthHandler,
  getLandingPageDetailsById
);
// Route to get all landing page details
landingPageRouter.get(
  "/get-all-landing-page-details",
  tokenAuthHandler,
  getLandingPageDetails
);
// Route to update landing page details
landingPageRouter.put(
  "/update-landing-page-details/:id",
  tokenAuthHandler,
  dynamicUpload.single("backgroundImage"),
  updateLandingPageDetails
);

export default landingPageRouter;
