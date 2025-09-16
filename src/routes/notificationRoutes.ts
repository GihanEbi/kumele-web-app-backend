import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import { not } from "joi";
import { fetchNotificationsByUserId } from "../controllers/notificationController";

const notificationRoute = Router();

notificationRoute.get(
  "/get-created-hobbies-notifications",
  tokenAuthHandler,
  fetchNotificationsByUserId
);

export default notificationRoute;
