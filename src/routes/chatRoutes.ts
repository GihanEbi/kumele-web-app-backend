// src/routes/chatRouter.ts

import { Router } from "express";
import {
  createMessageController,
  getMessagesByEventId,
} from "../controllers/chatController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const chatRouter = Router();

// Route to get all messages for a specific event
// Example URL: /api/chat/messages/some-event-123
chatRouter.get("/messages/:eventId", tokenAuthHandler, getMessagesByEventId);

// POST a new message to an event's chat
chatRouter.post(
  "/messages", // <-- The new route
  tokenAuthHandler,
  createMessageController
);

export default chatRouter;
