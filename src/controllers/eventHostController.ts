import { Request, Response, NextFunction } from "express";

import {
  createEventHostRatingService,
  getEventAverageRatingService,
  getEventRatingsService,
  getHostRatingsService,
  getHostReceivedRatingsService,
  getUserGivenRatingsService,
} from "../models/eventHostRatingModel";

// controller for create event host rating
export const createEventHostRatingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const creatorId = req.UserID;
  try {
    const { eventId, hostId, event_rating, host_rating, review } = req.body;
    const result = await createEventHostRatingService(
      creatorId,
      eventId,
      hostId,
      event_rating,
      host_rating,
      review
    );
    res.status(201).json({
      success: true,
      message: "Rating created successfully",
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

// controller to get average rating for event
export const getEventAverageRatingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventId = req.params.eventId;
  try {
    const result = await getEventAverageRatingService(eventId);
    res.status(200).json({
      success: true,
      message: "Event average rating retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve event average rating",
      error: error,
    });
    next(error);
  }
};

// controller to get all ratings for event
export const getEventRatingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventId = req.params.eventId;
  try {
    const result = await getEventRatingsService(eventId);
    res.status(200).json({
      success: true,
      message: "Event ratings retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve event ratings",
      error: error,
    });
    next(error);
  }
};

// controller to get all ratings given by a user
export const getUserGivenRatingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.UserID;
  try {
    const result = await getUserGivenRatingsService(userId);
    res.status(200).json({
      success: true,
      message: "User given ratings retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user given ratings",
      error: error,
    });
    next(error);
  }
};

// controller to get all ratings received by a host
export const getHostReceivedRatingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hostId = req.params.hostId;
  try {
    const result = await getHostReceivedRatingsService(hostId);
    res.status(200).json({
      success: true,
      message: "Host received ratings retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve host received ratings",
      error: error,
    });
    next(error);
  }
};

// controller to get all ratings for a host
export const getHostRatingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hostId = req.params.hostId;
  try {
    const result = await getHostRatingsService(hostId);
    res.status(200).json({
      success: true,
      message: "Host ratings retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve host ratings",
      error: error,
    });
    next(error);
  }
};
