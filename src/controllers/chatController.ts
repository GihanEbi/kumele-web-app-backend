// src/controllers/chatController.ts

import { Request, Response, NextFunction } from "express";
import { getMessagesByEventIdService ,createMessageService} from "../models/chatModel";

/**
 * Controller to get all messages for a given event ID.
 */
export const getMessagesByEventId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params; // Get eventId from URL parameters

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const messages = await getMessagesByEventIdService(eventId);

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve messages.",
    });
    next(err);
  }
};
/**
 * Controller to create a new message via HTTP POST.
 * It saves the message and then broadcasts it via Socket.io.
 */
export const createMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { event_id, message_text } = req.body;
    
    // Assuming your tokenAuthHandler adds the user object to the request
    // e.g., req.user = { id: 'some-user-id', username: 'john' }
    // @ts-ignore (or properly type your req.user)
    // const { id: user_id, username } = req.user;
    const user_id = req.UserID
    const username = req.username

    if (!event_id || !message_text || !user_id || !username) {
      return res.status(400).json({
        success: false,
        message: "event_id, message_text, and user authentication (including username) are required.",
      });
    }

    // 1. Save the message to the database
    const savedMessage = await createMessageService({
      event_id,
      message_text,
      user_id,
      username,
    });

    // 2. Broadcast the new message to the correct room using the attached io instance
    const io = req.io;
    io.to(event_id).emit("receiveMessage", savedMessage);

    // 3. Send a success response
    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: savedMessage,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to send message.",
    });
    next(err);
  }
};