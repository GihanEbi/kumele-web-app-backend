import { pool } from "../config/db";

const createPasskeysTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS passkeys (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(10) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      credential_id TEXT UNIQUE NOT NULL,
      public_key TEXT NOT NULL,
      counter INTEGER NOT NULL DEFAULT 0,
      device_type VARCHAR(100) NOT NULL DEFAULT 'unknown',
      last_used TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      -- Index for faster lookups by credential_id
      CONSTRAINT unique_credential_id UNIQUE (credential_id)
    )
  `;
  try {
    await pool.query(query);
    console.log("Passkeys table created successfully");
  } catch (error) {
    console.error("Error creating Passkeys table:", error);
  }
};

export default createPasskeysTable;