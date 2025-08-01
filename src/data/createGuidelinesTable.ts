import { pool } from "../config/db";

const createGuidelinesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_guidelines (
      id VARCHAR(6) PRIMARY KEY,
      guideline TEXT NOT NULL,
      how_to TEXT NOT NULL,
      popular TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("User Guidelines table created successfully");
  } catch (error) {
    console.error("Error creating User Guidelines table:", error);
  }
};

export default createGuidelinesTable;