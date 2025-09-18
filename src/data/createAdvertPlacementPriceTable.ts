import { pool } from "../config/db";

const createAdvertPlacementPriceTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS advert_placement_prices (
      id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
};
export default createAdvertPlacementPriceTable;
