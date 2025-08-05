import { pool } from "../config/db";

const createUserEventCategoryTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS user_event_categories (
        user_id VARCHAR(10) NOT NULL,
        event_category_id VARCHAR(10) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (event_category_id) REFERENCES event_categories(id)
      );
    `;
    await pool.query(query);
    console.log("User event categories table created successfully.");
  } catch (error) {
    console.error("Error creating user event categories table:", error);
  }
};

export default createUserEventCategoryTable;
