import { pool } from "../config/db";

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      ID VARCHAR(10) PRIMARY KEY,
      username VARCHAR(50),
      fullName VARCHAR(100) NOT NULL,
      email citext NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'Non-binary')),
      language VARCHAR(50) NOT NULL,
      dateOfBirth DATE NOT NULL,
      referralCode VARCHAR(50), 
      aboveLegalAge BOOLEAN NOT NULL DEFAULT false,
      termsAndConditionsAccepted BOOLEAN NOT NULL DEFAULT false,
      subscribedToNewsletter BOOLEAN NOT NULL DEFAULT false,
      profilePicture VARCHAR(255) DEFAULT '',
      about_me TEXT DEFAULT '',
      to_tp_secret TEXT DEFAULT '',
      is_2fa_enabled BOOLEAN NOT NULL DEFAULT false,
      my_referral_code VARCHAR(50) NOT NULL UNIQUE,
      qr_code_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("User table created successfully");
  } catch (error) {
    console.error("Error creating user table:", error);
  }
};

export default createUserTable;
