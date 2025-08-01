import { pool } from "../config/db";

const createUserHobbiesTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS user_hobbies (
        user_id VARCHAR(10) NOT NULL,
        hobby_id VARCHAR(10) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (hobby_id) REFERENCES hobbies(id)
      );
    `;
    await pool.query(query);
    console.log("User hobbies table created successfully.");
  } catch (error) {
    console.error("Error creating user hobbies table:", error);
  }
};

export default createUserHobbiesTable;
