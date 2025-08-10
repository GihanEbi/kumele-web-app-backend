import { pool } from "../config/db";

const createUserSubscriptionTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_subscriptions (
      user_id VARCHAR(10) NOT NULL,
      subscription_id VARCHAR(10) NOT NULL,
      start_date TIMESTAMP NOT NULL DEFAULT NOW(),
      end_date TIMESTAMP NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (subscription_id) REFERENCES subscription_data(id)
    )
  `;
  try {
    await pool.query(query);
    console.log("user_subscriptions table created successfully.");
  } catch (error) {
    console.error("Error creating user_subscriptions table:", error);
  }
};

export default createUserSubscriptionTable;
