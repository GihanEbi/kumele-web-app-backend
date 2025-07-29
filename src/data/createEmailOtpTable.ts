import { pool } from "../config/db";

const createEmailOtpTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS email_otp (
      email VARCHAR(100) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      isVerified BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Email OTP table created successfully");
  } catch (error) {
    console.error("Error creating email OTP table:", error);
  }
};

export default createEmailOtpTable;
