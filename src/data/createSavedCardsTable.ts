import { pool } from "../config/db";

const createSavedCardsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS saved_paypal_cards (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL, -- Or INTEGER, depending on your users table
      paypal_token_id VARCHAR(255) NOT NULL UNIQUE,
      card_brand VARCHAR(50),
      last4 VARCHAR(4),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Assumes a 'users' table with 'id'
    )
  `;
  try {
    await pool.query(query);
    console.log("Saved PayPal Cards table created successfully");
  } catch (error) {
    console.error("Error creating Saved PayPal Cards table:", error);
  }
};

export default createSavedCardsTable;