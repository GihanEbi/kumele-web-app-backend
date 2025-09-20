import { Router } from "express";
import {
  createEventHostRatingController,
  getEventAverageRatingController,
  getEventRatingsController,
  getUserGivenRatingsController,
  getHostReceivedRatingsController,
  getHostRatingsController,
} from "../controllers/eventHostController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const eventHostRatingRoutes = Router();
eventHostRatingRoutes.post(
  "/create-event-host-rating",
  tokenAuthHandler,
  createEventHostRatingController
);
eventHostRatingRoutes.get(
  "/get-event-average-rating/:eventId",
  tokenAuthHandler,
  getEventAverageRatingController
);
eventHostRatingRoutes.get(
  "/get-event-ratings/:eventId",
  tokenAuthHandler,
  getEventRatingsController
);
eventHostRatingRoutes.get(
  "/get-user-given-ratings/:userId",
  tokenAuthHandler,
  getUserGivenRatingsController
);
eventHostRatingRoutes.get(
  "/get-host-received-ratings/:hostId",
  tokenAuthHandler,
  getHostReceivedRatingsController
);
eventHostRatingRoutes.get(
  "/get-host-ratings/:hostId",
  tokenAuthHandler,
  getHostRatingsController
);
export default eventHostRatingRoutes;
