import { pool } from "../config/db";

const createMessagesTable = async () => {
  // We assume you have a 'users' table with a user_id and an 'events' table with an event_id.
  // The FOREIGN KEY constraints ensure data integrity.
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id VARCHAR(255) NOT NULL, -- Or whatever type your event ID is
      user_id VARCHAR(255) NOT NULL,  -- Or whatever type your user ID is
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      -- Add foreign key constraints if you have users and events tables
      -- FOREIGN KEY (user_id) REFERENCES users(id),
      -- FOREIGN KEY (event_id) REFERENCES events(id)
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