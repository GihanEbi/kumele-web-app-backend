import { pool } from "../config/db";

const createPlisioPaymentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS plisio_payments (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      txn_id VARCHAR(100),
      invoice_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ Plisio payments table created successfully");
  } catch (error) {
    console.error("❌ Error creating Plisio payments table:", error);
  }
};

export default createPlisioPaymentsTable;
