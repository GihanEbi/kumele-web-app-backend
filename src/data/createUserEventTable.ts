import { pool } from "../config/db";

const createUserEventTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS user_event (
            id VARCHAR(10) PRIMARY KEY,
            user_id VARCHAR(10) NOT NULL,
            event_id VARCHAR(10) NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
            FOREIGN KEY (event_id) REFERENCES events(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
  try {
    await pool.query(query);
    console.log("User event table created successfully.");
  } catch (error) {
    console.error("Error creating user event table:", error);
  }
};

export default createUserEventTable;
