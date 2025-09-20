import { pool } from "../config/db";

const createEventReportTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS event_reports (
      id VARCHAR(10) PRIMARY KEY,
      event_id VARCHAR(10) NOT NULL,
      user_id VARCHAR(10) NOT NULL,
      reason TEXT NOT NULL CHECK (reason IN ('RACIST', 'SCAM', 'PHYSICAL_ASSAULT', 'OTHER')),
      comments TEXT,
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Event Report table created successfully.");
  } catch (error) {
    console.error("Error creating Event Report table:", error);
  }
};
export default createEventReportTable;
