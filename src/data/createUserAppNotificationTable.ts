import { pool } from "../config/db";

const createUserAppNotificationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_app_notification (
      notification_id VARCHAR(255) NOT NULL,
      user_id VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL CHECK (status IN ('READ', 'UNREAD')) DEFAULT 'UNREAD',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      Foreign KEY (notification_id) REFERENCES notification(id) ON DELETE CASCADE,
      Foreign KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  try {
    await pool.query(query);
    console.log("User App Notification table created successfully.");
  } catch (error) {
    console.error("Error creating User App Notification table:", error);
  }
};

export default createUserAppNotificationTable;
