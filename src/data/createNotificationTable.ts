import { pool } from "../config/db";

const createNotificationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notification (
      id VARCHAR(10) PRIMARY KEY,
      type VARCHAR(50) NOT NULL CHECK (type IN ('MATCH_HOBBIES', 'CREATE_HOBBIES', 'OTHER_NOTIFICATIONS', 'CHAT_NOTIFICATIONS')),
      title VARCHAR(255) NOT NULL,
      event_id VARCHAR(10),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
  `;
  try {
    await pool.query(query);
    console.log("Notification table created successfully.");
  } catch (error) {
    console.error("Error creating notification table:", error);
  }
};

export default createNotificationTable;
