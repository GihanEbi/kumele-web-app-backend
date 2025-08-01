import { pool } from "../config/db";

const createHobbiesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS hobbies (
      id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      svg_code TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Hobbies table created successfully");
  } catch (error) {
    console.error("Error creating hobbies table:", error);
  }
};

export default createHobbiesTable;
