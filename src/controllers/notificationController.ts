import { Request, Response, NextFunction } from "express";
import { getNotificationsByUserId } from "../models/notificationModel";

export const fetchNotificationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.UserID; // Assuming user ID is stored in req.UserID
    const notifications = await getNotificationsByUserId(user_id);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};
