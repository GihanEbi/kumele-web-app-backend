import { pool } from "../config/db";

const createAdvertRegionTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS advert_region (
      id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(query);
    console.log("Advert region table created successfully");
  } catch (error) {
    console.error("Error creating Advert region table:", error);
  }
};

export default createAdvertRegionTable;
