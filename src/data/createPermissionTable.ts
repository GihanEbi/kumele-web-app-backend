import { pool } from "../config/db";

const createPermissionTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS permissions (
      user_id VARCHAR(10) REFERENCES users(ID),
      allow_notifications BOOLEAN NOT NULL,
      allow_photos VARCHAR(10) NOT NULL CHECK (allow_photos IN ('non', 'all', 'selected')),
      allow_location VARCHAR(20) NOT NULL CHECK (allow_location IN ('non', 'once', 'while_using')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("permissions table created successfully");
  } catch (error) {
    console.error("Error creating permissions table:", error);
  }
};

export default createPermissionTable;
