import { pool } from "../config/db";

const createUserBetaCodeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_beta_codes (
      email VARCHAR(255) NOT NULL,
      beta_code VARCHAR(10) NOT NULL,
      is_used BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(query);
    console.log("user_beta_codes table created successfully.");
  } catch (error) {
    console.error("Error creating user_beta_codes table:", error);
  }
};

export default createUserBetaCodeTable;
