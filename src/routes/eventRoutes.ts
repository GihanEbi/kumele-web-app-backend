import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

// Import the new dynamic uploader
import { dynamicUpload } from "../config/multer.config";
import {
  createEvent,
  getAllEvents,
  getEventByCategoryID,
  getEventById,
  getEventByUserID,
  updateEvent,
  userAvailabilityController,
} from "../controllers/eventController";

const eventRoutes = Router();

// Define your event-related routes here
eventRoutes.post(
  "/create-event",
  tokenAuthHandler,
  dynamicUpload.single("event_image"),
  createEvent
);
eventRoutes.get("/get-all-events", tokenAuthHandler, getAllEvents);
eventRoutes.get(
  "/get-event-by-user-id/:userId",
  tokenAuthHandler,
  getEventByUserID
);
eventRoutes.get(
  "/get-event-by-category-id/:categoryId",
  tokenAuthHandler,
  getEventByCategoryID
);
eventRoutes.get("/get-event-by-id/:eventId", tokenAuthHandler, getEventById);

eventRoutes.put(
  "/update-event-by-id/:eventId",
  tokenAuthHandler,
  dynamicUpload.single("event_image"),
  updateEvent
);

eventRoutes.post(
  "/check-user-availability",
  tokenAuthHandler,
  userAvailabilityController
);

export default eventRoutes;
