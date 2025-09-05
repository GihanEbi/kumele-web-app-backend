// src/models/chatModel.ts

import { pool } from "../config/db";
import { systemConfig } from "../config/systemConfig";

// Interface for a message object for type safety
export interface IMessage {
  id?: string;
  event_id: string;
  user_id: string;
  username: string;
  message_text: string;
  created_at?: Date;
  profilepicture?: string;
}

/**
 * Saves a new message to the database.
 */
export const createMessageService = async (
  messageData: IMessage
): Promise<IMessage> => {
  const { event_id, user_id, username, message_text, profilepicture } =
    messageData;
  try {
    const result = await pool.query(
      `INSERT INTO messages (event_id, user_id, username, message_text, profilepicture) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [event_id, user_id, username, message_text, profilepicture]
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
  //   const result = await pool.query(
  //     `
  // SELECT 
  //   m.id AS message_id,
  //   m.event_id,
  //   m.message_text,
  //   m.created_at,
  //   u.id AS user_id,
  //   u.username,
  //   u.profilePicture
  // FROM messages m
  // JOIN users u ON m.user_id = u.id
  // WHERE m.event_id = $1
  // ORDER BY m.created_at ASC
  // `,
  //     [eventId]
  //   );
  //   const messages = result.rows.map((row) => {
  //     return {
  //       ...row,
  //       profilepicture: row.profilepicture
  //         ? systemConfig.baseUrl + "/" + row.profilepicture.replace(/\\/g, "/") // fix Windows slashes
  //         : null,
  //     };
  //   });
    return result.rows;
  } catch (error) {
    console.error(`Error fetching messages for event ${eventId}:`, error);
    throw new Error("Failed to fetch messages.");
  }
};
