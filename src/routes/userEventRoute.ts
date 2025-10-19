import { Router } from "express";
import {
  createUserEventController,
  acceptUserEventController,
  cancelUserEventController,
  getAllUserEventsByEventIdController,
  getAllUserEventsController,
  getCancelledUserEventsByUserIdController,
  getConfirmedUserEventsByUserIdController,
  getPendingUserEventsByUserIdController,
  checkInUserEventController,
} from "../controllers/userEventController";

import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
const userEventRoutes = Router();
userEventRoutes.post(
  "/create-user-event",
  tokenAuthHandler,
  createUserEventController
);

userEventRoutes.put(
  "/accept-user-event/:userEventId",
  tokenAuthHandler,
  acceptUserEventController
);

userEventRoutes.put(
  "/check-in-user-event/:userEventId",
  tokenAuthHandler,
  checkInUserEventController
);

userEventRoutes.put(
  "/cancel-user-event/:id",
  tokenAuthHandler,
  cancelUserEventController
);

userEventRoutes.get(
  "/get-all-user-events-by-event-id/:eventId",
  tokenAuthHandler,
  getAllUserEventsByEventIdController
);

userEventRoutes.get(
  "/get-all-user-events",
  tokenAuthHandler,
  getAllUserEventsController
);

userEventRoutes.get(
  "/get-pending-user-events-by-user-id",
  tokenAuthHandler,
  getPendingUserEventsByUserIdController
);

userEventRoutes.get(
  "/get-confirmed-user-events-by-user-id",
  tokenAuthHandler,
  getConfirmedUserEventsByUserIdController
);

userEventRoutes.get(
  "/get-cancelled-user-events-by-user-id",
  tokenAuthHandler,
  getCancelledUserEventsByUserIdController
);

export default userEventRoutes;
