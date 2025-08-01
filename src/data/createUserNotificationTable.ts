import { pool } from "../config/db";

const createUserNotificationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_notifications (
      userID VARCHAR(10) NOT NULL,
      sound_notifications BOOLEAN DEFAULT false,
      email_notifications BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userID) REFERENCES users(ID) ON DELETE CASCADE
    )
  `;
  try {
    await pool.query(query);
    console.log("User notification table created successfully");
  } catch (error) {
    console.error("Error creating user notification table:", error);
  }
};

export default createUserNotificationTable;
