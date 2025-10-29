import { pool } from "../config/db";

const createAdvertPaymentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS advert_payments (
      id SERIAL PRIMARY KEY,
      advert_id VARCHAR(10) NOT NULL,
      stripe_payment_intent_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("Advert payment table created successfully.");
  } catch (error) {
    console.error("Error creating advert payment table:", error);
  }
};

export default createAdvertPaymentTable;
