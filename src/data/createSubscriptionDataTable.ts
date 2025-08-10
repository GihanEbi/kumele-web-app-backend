import { pool } from "../config/db";

const createSubscriptionDataTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS subscription_data (
            id VARCHAR(10) PRIMARY KEY,
            icon_code TEXT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            validity_period INTERVAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
  try {
    await pool.query(query);
    console.log("subscription_data table created successfully.");
  } catch (error) {
    console.error("Error creating subscription_data table:", error);
  }
};

export default createSubscriptionDataTable;
