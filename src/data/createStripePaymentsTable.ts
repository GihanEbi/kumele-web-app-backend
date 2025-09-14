import { pool } from "../config/db";

const createStripePaymentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS stripe_payments (
      id SERIAL PRIMARY KEY,
      stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Stripe Payments table created successfully");
  } catch (error) {
    console.error("Error creating Stripe Payments table:", error);
  }
};

export default createStripePaymentsTable;