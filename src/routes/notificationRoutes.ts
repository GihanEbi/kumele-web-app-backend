import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import { not } from "joi";
import { fetchAllUnreadNotificationsCountByUserId, fetchMatchHobbiesNotificationsByUserIdController, fetchNotificationsByUserId } from "../controllers/notificationController";

const notificationRoute = Router();

// notificationRoute.get(
//   "/get-created-hobbies-notifications",
//   tokenAuthHandler,
//   fetchNotificationsByUserId
// );

notificationRoute.get(
  "/get-unread-notifications-count",
  tokenAuthHandler,
  fetchAllUnreadNotificationsCountByUserId
);

notificationRoute.get(
  "/get-created-hobbies-notifications",
  tokenAuthHandler,
  fetchMatchHobbiesNotificationsByUserIdController
);

export default notificationRoute;
