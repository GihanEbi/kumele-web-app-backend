import { pool } from "../config/db";

const createFollowingFollowerTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS following_follower (
        following_id VARCHAR(10) NOT NULL,
        follower_id VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (following_id) REFERENCES users(id),
        FOREIGN KEY (follower_id) REFERENCES users(id)
      )
    `;
    await pool.query(query);
    console.log("Following/Follower table created successfully.");
  } catch (error) {
    console.error("Error creating Following/Follower table:", error);
  }
};
export default createFollowingFollowerTable;
