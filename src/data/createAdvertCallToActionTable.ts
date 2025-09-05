import { pool } from "../config/db";

const createAdvertCallToActionTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS advert_call_to_actions (
      id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(query);
    console.log("Advert Call To Action table created successfully");
  } catch (error) {
    console.error("Error creating Advert Call To Action table:", error);
  }
};

export default createAdvertCallToActionTable;
