import { pool } from "../config/db";

const createTermsConditionTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS terms_conditions (
      id VARCHAR(6) PRIMARY KEY,
      terms_cond TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Terms and Conditions table created successfully");
  } catch (error) {
    console.error("Error creating terms and conditions table:", error);
  }
};
export default createTermsConditionTable;
