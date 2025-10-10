import { pool } from "../config/db";

const createCryptoPaymentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS crypto_payments (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      product_id VARCHAR(255), -- Or order_id, etc.
      amount_usd DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, EXPIRED
      charge_code VARCHAR(50) UNIQUE NOT NULL, -- The unique code from Coinbase
      hosted_url TEXT, -- The payment URL for the user
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Crypto Payments table created successfully");
  } catch (error) {
    console.error("Error creating Crypto Payments table:", error);
  }
};

export default createCryptoPaymentsTable;