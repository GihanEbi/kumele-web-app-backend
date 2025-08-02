import { pool } from "../config/db";

const createLandingPageLinksTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS landing_page_links (
      id VARCHAR(10) PRIMARY KEY,
      android_app_link TEXT NOT NULL,
      ios_app_link TEXT NOT NULL,
      youtube_link TEXT NOT NULL,
      facebook_link TEXT NOT NULL,
      instagram_link TEXT NOT NULL,
      twitter_link TEXT NOT NULL,
      pinterest_link TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(query);
    console.log("Landing page links table created successfully");
  } catch (error) {
    console.error("Error creating landing page links table:", error);
  }
};

export default createLandingPageLinksTable;
