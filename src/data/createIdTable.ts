import { pool } from "../config/db";

const createIdTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS id_codes (
      code VARCHAR(10) PRIMARY KEY,
      seq INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("ID Codes table created successfully");
  } catch (error) {
    console.error("Error creating ID Codes table:", error);
  }
};

export default createIdTable;
