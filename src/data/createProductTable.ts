import { pool } from "../config/db";

const createProductTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      type VARCHAR(50) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Products table created successfully");
  } catch (error) {
    console.error("Error creating Products table:", error);
  }
};

export default createProductTable;
