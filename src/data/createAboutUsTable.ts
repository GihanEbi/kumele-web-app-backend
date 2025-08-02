import { pool } from "../config/db";

const createAboutUsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS about_us (
      id VARCHAR(10) PRIMARY KEY,
      about_us TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("About Us table created successfully");
  } catch (error) {
    console.error("Error creating About Us table:", error);
  }
};
export default createAboutUsTable;
