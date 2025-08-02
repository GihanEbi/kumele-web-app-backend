import { pool } from "../config/db";

const createLandingPageDetailsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS landing_page_details (
      id VARCHAR(10) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      bottom_text VARCHAR(255) NOT NULL,
      background_image_url VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Landing Page Details table created successfully");
  } catch (error) {
    console.error("Error creating Landing Page Details table:", error);
  }
};

export default createLandingPageDetailsTable;
