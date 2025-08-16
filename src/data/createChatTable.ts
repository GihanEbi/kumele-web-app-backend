// src/db/tables/createChatTable.ts

import { pool } from "../config/db";

const createMessagesTable = async () => {
  // We assume you have a 'users' table with an 'id' and 'username'
  // and an 'events' table with an 'id'.
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id VARCHAR(255) NOT NULL, -- Assuming event IDs are strings. Adjust if they are INTs.
      user_id VARCHAR(255) NOT NULL, -- Assuming user IDs are strings (e.g., from your users table).
      username VARCHAR(100) NOT NULL, -- Storing username for convenience to avoid extra joins.
      message_text TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("Messages table created successfully");
  } catch (error) {
    console.error("Error creating Messages table:", error);
  }
};

export default createMessagesTable;