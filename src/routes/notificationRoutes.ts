import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import { not } from "joi";
import {
  fetchAllUnreadNotificationsCountByUserId,
  fetchCreatedHobbiesNotificationsByUserIdController,
  fetchFollowerEventNotificationsByUserIdController,
  fetchMatchHobbiesNotificationsByUserIdController,
} from "../controllers/notificationController";

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
  fetchCreatedHobbiesNotificationsByUserIdController
);

notificationRoute.get(
  "/get-follower-event-notifications",
  tokenAuthHandler,
  fetchFollowerEventNotificationsByUserIdController
);

notificationRoute.get(
  "/get-match-hobbies-notifications",
  tokenAuthHandler,
  fetchMatchHobbiesNotificationsByUserIdController
);

export default notificationRoute;
