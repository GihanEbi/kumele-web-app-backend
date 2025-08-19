import { pool } from "../config/db";

const createCardsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_cards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR(255) NOT NULL, -- Foreign key to your users table
      paypal_token VARCHAR(255) NOT NULL UNIQUE, -- The secure token from PayPal
      card_type VARCHAR(50), -- e.g., 'VISA', 'MASTERCARD'
      last4 VARCHAR(4), -- Last 4 digits for display
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("User Cards table created successfully");
  } catch (error) {
    console.error("Error creating User Cards table:", error);
  }
};

export default createCardsTable;