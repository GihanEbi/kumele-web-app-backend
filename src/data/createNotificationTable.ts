import { pool } from "../config/db";

const createNotificationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notification (
      id VARCHAR(10) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      event_category_id VARCHAR(10),
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      created_by VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_category_id) REFERENCES event_categories(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
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
