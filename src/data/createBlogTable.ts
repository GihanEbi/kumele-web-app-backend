import { pool } from "../config/db";

const createBlogTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(10) PRIMARY KEY,
      event_category_id VARCHAR(10) REFERENCES event_categories(id),
      blog_name VARCHAR(255) NOT NULL,
      banner_img_url TEXT NOT NULL,
      blog_img_url TEXT NOT NULL,
      blog_video_link TEXT,
      youtube_link TEXT,
      facebook_link TEXT,
      instagram_link TEXT,
      pinterest_link TEXT,
      twitter_link TEXT,
      blog_content TEXT NOT NULL,
      author_id VARCHAR(10) REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Blog table created successfully");
  } catch (error) {
    console.error("Error creating About Us table:", error);
  }
};

export default createBlogTable;
