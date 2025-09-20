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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User event creation failed",
      error: error,
    });
    next(error);
  }
};

// controller for accept user event
export const acceptUserEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userEventId = req.params.id;
  try {
    const result = await acceptUserEventService(userEventId);
    res.status(200).json({
      success: true,
      message: "User event accepted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User event acceptance failed",
      error: error,
    });
    next(error);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User event cancellation failed",
      error: error,
    });
    next(error);
  }
};

// controller to get all user events by event id
export const getAllUserEventsByEventIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventId = req.params.eventId;
  try {
    const result = await getAllUserEventsByEventIdService(eventId);
    res.status(200).json({
      success: true,
      message: "User events retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User events retrieval failed",
      error: error,
    });
    next(error);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User events retrieval failed",
      error: error,
    });
    next(error);
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
      message: "Cancelled user events retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cancelled user events retrieval failed",
      error: error,
    });
    next(error);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Confirmed user events retrieval failed",
      error: error,
    });
    next(error);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Pending user events retrieval failed",
      error: error,
    });
    next(error);
  }
};
