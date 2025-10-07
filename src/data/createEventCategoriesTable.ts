import { pool } from "../config/db";

const createEventCategoriesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS event_categories (
      id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      svg_code TEXT NOT NULL,
      icon_dark_img_url TEXT,
      icon_light_img_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Event categories table created successfully");
  } catch (error) {
    console.error("Error creating event categories table:", error);
  }
};

export default createEventCategoriesTable;
