import { Request, Response, NextFunction } from "express";

import {
  getEventReportReasons,
  createEventReportService,
  getAllEventReportsService,
  getEventReportsByEventIdService,
  getEventReportsByUserIdService,
} from "../models/eventReportModel";

// controller to get event report reasons
export const getEventReportReasonsController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reasons = getEventReportReasons();
    res.status(201).json({
      success: true,
      message: "Event report reasons fetched successfully",
      data: reasons,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch event report reasons.",
    });
    next(err);
  }
};

// controller to create event report
export const createEventReportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.UserID;
    const { event_id, reason, comments } = req.body;
    const result = await createEventReportService(
      user_id,
      event_id,
      reason,
      comments
    );
    res.status(201).json({
      success: true,
      message: "Event report created successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to create event report.",
    });
    next(err);
  }
};

// controller to get all event reports
export const getAllEventReportsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllEventReportsService();
    res.status(200).json({
      success: true,
      message: "Event reports fetched successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch event reports.",
    });
    next(err);
  }
};

// get all event reports by event id
export const getEventReportsByEventIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.eventId;
    const result = await getEventReportsByEventIdService(eventId);
    res.status(200).json({
      success: true,
      message: "Event reports fetched successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch event reports by event ID.",
    });
    next(err);
  }
};

// get all reports by user id
export const getEventReportsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const result = await getEventReportsByUserIdService(userId);
    res.status(200).json({
      success: true,
      message: "Event reports fetched successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch event reports by user ID.",
    });
    next(err);
  }
};
