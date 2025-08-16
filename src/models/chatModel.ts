// src/models/chatModel.ts

import { pool } from "../config/db";

// Interface for a message object for type safety
export interface IMessage {
  id?: string;
  event_id: string;
  user_id: string;
  username: string;
  message_text: string;
  created_at?: Date;
}

/**
 * Saves a new message to the database.
 */
export const createMessageService = async (
  messageData: IMessage
): Promise<IMessage> => {
  const { event_id, user_id, username, message_text } = messageData;
  try {
    const result = await pool.query(
      `INSERT INTO messages (event_id, user_id, username, message_text) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [event_id, user_id, username, message_text]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating message:", error);
    throw new Error("Failed to save message to the database.");
  }
};

/**
 * Fetches all messages for a specific event, ordered by creation time.
 */
export const getMessagesByEventIdService = async (
  eventId: string
): Promise<IMessage[]> => {
  try {
    const result = await pool.query(
      `SELECT * FROM messages WHERE event_id = $1 ORDER BY created_at ASC`,
      [eventId]
    );
    return result.rows;
  } catch (error) {
    console.error(`Error fetching messages for event ${eventId}:`, error);
    throw new Error("Failed to fetch messages.");
  }
};