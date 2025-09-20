import { pool } from "../config/db";

const createEventHostRatingTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS event_host_ratings (
        id VARCHAR(10) PRIMARY KEY,
        creator_id VARCHAR(10) NOT NULL,
        event_id VARCHAR(10) NOT NULL,
        host_id VARCHAR(10) NOT NULL,
        event_rating INT CHECK (event_rating >= 1 AND event_rating <= 5),
        host_rating INT CHECK (host_rating >= 1 AND host_rating <= 5),
        review TEXT,
        FOREIGN KEY (event_id) REFERENCES events(id),
        FOREIGN KEY (creator_id) REFERENCES users(id),
        FOREIGN KEY (host_id) REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
    );
    `;

  try {
    await pool.query(query);
    console.log("Event Host Rating table created successfully.");
  } catch (error) {
    console.error("Error creating Event Host Rating table:", error);
  }
};

export default createEventHostRatingTable;
