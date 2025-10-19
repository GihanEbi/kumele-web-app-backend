import { Request, Response, NextFunction } from "express";
import {
  createUserEventService,
  acceptUserEventService,
  cancelUserEventService,
  getAllUserEventsByEventIdService,
  getAllUserEventsService,
  getCancelledUserEventsByUserIdService,
  getConfirmedUserEventsByUserIdService,
  getPendingUserEventsByUserIdService,
  checkInUserEventService,
} from "../models/userEventModel";

// controller for create user event
export const createUserEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.UserID;
  try {
    const { eventId } = req.body;
    const result = await createUserEventService(userId, eventId);
    res.status(201).json({
      success: true,
      message: "User event created successfully",
      data: result,
    });
  }  catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to create user event.",
    });
    next(err);
  }
};

// controller for accept user event
export const acceptUserEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userEventId = req.params.userEventId;
  try {
    const result = await acceptUserEventService(userEventId);
    res.status(200).json({
      success: true,
      message: "User event accepted successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to accept user events.",
    });
    next(err);
  }
};

// controller for check in user event
export const checkInUserEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userEventId = req.params.userEventId;
  const checkedInBy = req.UserID;
  try {
    const result = await checkInUserEventService(userEventId, checkedInBy);
    res.status(200).json({
      success: true,
      message: "User event checked in successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to check in user event.",
    });
    next(err);
  }
};

// controller for cancel user event
export const cancelUserEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userEventId = req.params.id;
  try {
    const result = await cancelUserEventService(userEventId);
    res.status(200).json({
      success: true,
      message: "User event cancelled successfully",
      data: result,
    });
  }  catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to cancel user event.",
    });
    next(err);
  }
};

// controller to get all user events by event id
export const getAllUserEventsByEventIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventId = req.params.eventId;
  const user_id = req.UserID;
  try {
    const result = await getAllUserEventsByEventIdService(eventId, user_id);
    res.status(200).json({
      success: true,
      message: "User events retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve user events.",
    });
    next(err);
  }
};

// controller to get all user events
export const getAllUserEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllUserEventsService();
    res.status(200).json({
      success: true,
      message: "User events retrieved successfully",
      data: result,
    });
  }  catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve user events.",
    });
    next(err);
  }
};

// controller to get cancelled user events by user id
export const getCancelledUserEventsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.UserID;
  try {
    const result = await getCancelledUserEventsByUserIdService(userId);
    res.status(200).json({
      success: true,
      message: "Cancelled user events successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to cancel user events.",
    });
    next(err);
  }
};

// controller to get getConfirmedUserEventsByUserIdService
export const getConfirmedUserEventsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.UserID;
  try {
    const result = await getConfirmedUserEventsByUserIdService(userId);
    res.status(200).json({
      success: true,
      message: "Confirmed user events retrieved successfully",
      data: result,
    });
  }  catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve user events.",
    });
    next(err);
  }
};

// controller to get getPendingUserEventsByUserIdService
export const getPendingUserEventsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.UserID;
  try {
    const result = await getPendingUserEventsByUserIdService(userId);
    res.status(200).json({
      success: true,
      message: "Pending user events retrieved successfully",
      data: result,
    });
  }  catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve user events.",
    });
    next(err);
  }
};
