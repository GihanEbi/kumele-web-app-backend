import { pool } from "../config/db";

const createBlogCommentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS blog_comments (
      id VARCHAR(10) PRIMARY KEY,
      reply_to VARCHAR(10),
      blog_id VARCHAR(10) NOT NULL,
      user_id VARCHAR(10) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  try {
    await pool.query(query);
    console.log("Blog comments table created successfully.");
  } catch (error) {
    console.error("Error creating blog comments table:", error);
  }
};

export default createBlogCommentTable;
