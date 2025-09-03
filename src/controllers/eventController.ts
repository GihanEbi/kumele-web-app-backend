import { Request, Response, NextFunction } from "express";
import {
  createEventService,
  getAllEventsService,
  getEventByCategoryIDService,
  getEventByIdService,
  getEventByUserIDService,
  updateEventByIdService,
} from "../models/eventModel";
import fs from "fs";

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }
    const user_id = req.UserID;
    req.body.event_image_url = req.file.path;
    req.body.user_id = user_id;

    console.log(req.body);

    // Call the createEventService to create the event
    const newEvent = await createEventService(req.body);

    res
      .status(201)
      .json({
        success: true,
        message: "Event created successfully.",
        event: newEvent,
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Event creation failed",
      error: err,
    });
    next(err);
  }
};

// This function retrieves all events from the database
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Call the service to get all events
    const events = await getAllEventsService();

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve events",
      error: err,
    });
    next(err);
  }
};

// This function retrieves events by user ID
export const getEventByUserID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const events = await getEventByUserIDService(userId);
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve events",
      error: err,
    });
    next(err);
  }
};

// This function retrieves events by category ID
export const getEventByCategoryID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.categoryId;
    const events = await getEventByCategoryIDService(categoryId);
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve events",
      error: err,
    });
    next(err);
  }
};

// This function retrieves events by Id
export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.eventId;
    const events = await getEventByIdService(eventId);
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve event",
      error: err,
    });
    next(err);
  }
};

// This function updates an event by Id
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.eventId;
    const eventData = req.body;

    // check if the eventId is provided
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    // remove destination and event_image from req.body
    delete eventData.destination;
    delete eventData.event_image;

    // 2. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }
    req.body.event_image_url = req.file.path;
    // 3. (Optional but Recommended) Delete the old image path
    const oldEvent = await getEventByIdService(eventId);
    if (oldEvent && oldEvent.event_image_url) {
      // Delete the old image file from the server
      fs.unlink(oldEvent.event_image_url, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        }
      });
    }

    const updatedEvent = await updateEventByIdService(eventId, eventData);
    res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: err,
    });
    next(err);
  }
};
