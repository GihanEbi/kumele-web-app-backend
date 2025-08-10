import { pool } from "../config/db";

const createGuestTicketsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS guest_tickets (
            id VARCHAR(10) PRIMARY KEY,
            icon_code TEXT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

export default createGuestTicketsTable;
