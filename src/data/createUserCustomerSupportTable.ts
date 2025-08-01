import { pool } from "../config/db";

const createUserCustomerSupportTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_customer_support (
      id VARCHAR(10) PRIMARY KEY,
      user_id VARCHAR(10) NOT NULL,
      support_type VARCHAR(50) NOT NULL CHECK (support_type IN ('business', 'complaint', 'improvement')),
      support_message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  try {
    await pool.query(query);
    console.log("User Customer Support table created successfully");
  } catch (error) {
    console.error("Error creating User Customer Support table:", error);
  }
};

export default createUserCustomerSupportTable;
