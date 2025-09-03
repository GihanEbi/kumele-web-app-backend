import { pool } from "../config/db";

const createEventTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(10) PRIMARY KEY,
        user_id VARCHAR(10) NOT NULL REFERENCES users(id),
        category_id VARCHAR(10) NOT NULL REFERENCES event_categories(id),
        event_image_url Text NOT NULL,
        event_name VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_start_in VARCHAR(50) NOT NULL,
        event_date TEXT NOT NULL,
        event_start_time TEXT NOT NULL,
        event_end_time TEXT NOT NULL,
        street_address VARCHAR(255) NOT NULL,
        home_number VARCHAR(50) NOT NULL,
        district VARCHAR(100) NOT NULL,
        postal_zip_code VARCHAR(20) NOT NULL,
        state VARCHAR(100) NOT NULL,
        age_range_min VARCHAR(10) NOT NULL,
        age_range_max VARCHAR(10) NOT NULL,
        max_guests VARCHAR(10) NOT NULL,
        payment_type TEXT NOT NULL,
        price VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log("Events table created successfully.");
  } catch (error) {
    console.error("Error creating events table:", error);
  }
};

export default createEventTable;
