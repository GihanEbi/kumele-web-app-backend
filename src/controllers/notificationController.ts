import { Request, Response, NextFunction } from "express";
import {
  getAllUnreadNotificationsCountByUserId,
  getCreateHobbiesNotificationsByUserId,
  getMatchHobbiesNotificationsByUserId,
  getNotificationsByUserId,
} from "../models/notificationModel";

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

// get all unread notifications for a user
export const fetchAllUnreadNotificationsCountByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.UserID; // Assuming user ID is stored in req.UserID
    const count = await getAllUnreadNotificationsCountByUserId(user_id);
    res.status(200).json({
      success: true,
      message: "Unread notifications count fetched successfully",
      data: count,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch unread notifications count.",
    });
    next(err);
  }
};

// get created event notifications by user id
export const fetchMatchHobbiesNotificationsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.UserID; // Assuming user ID is stored in req.UserID
    const notifications = await getCreateHobbiesNotificationsByUserId(user_id);
    res.status(200).json({
      success: true,
      message: "Created hobbies notifications fetched successfully",
      data: notifications,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch created hobbies notifications.",
    });
    next(err);
  }
};
