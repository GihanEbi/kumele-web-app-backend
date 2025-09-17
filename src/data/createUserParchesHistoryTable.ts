import { pool } from "../config/db";

const createUserParchesHistoryTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS user_purchases_history (
            id VARCHAR(10) PRIMARY KEY,
            user_id VARCHAR(10) NOT NULL,
            product_id VARCHAR(10) NOT NULL,
            purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `;
  try {
    await pool.query(query);
    console.log("User Purchases History table created successfully");
  } catch (error) {
    console.error("Error creating User Purchases History table:", error);
  }
};

export default createUserParchesHistoryTable;
