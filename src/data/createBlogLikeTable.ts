import { pool } from "../config/db";

const createBlogLikeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS blog_likes (
      blog_id VARCHAR(10) NOT NULL,
      user_id VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (blog_id) REFERENCES blogs(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  try {
    await pool.query(query);
    console.log("Blog Likes table created successfully");
  } catch (error) {
    console.error("Error creating Blog Likes table:", error);
  }
};

export default createBlogLikeTable;
