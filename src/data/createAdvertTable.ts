import { pool } from "../config/db";

const createAdvertTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS adverts (
        id VARCHAR(10) PRIMARY KEY,
        user_id VARCHAR(10) NOT NULL REFERENCES users(id),
        category_id VARCHAR(10) NOT NULL REFERENCES event_categories(id),
        advert_image_type VARCHAR(10) NOT NULL CHECK (advert_image_type IN ('static', 'carousel')),
        advert_image_url_1 TEXT NOT NULL,
        advert_image_url_2 TEXT,
        advert_image_url_3 TEXT,
        call_to_action TEXT NOT NULL,
        call_to_action_link TEXT NOT NULL,
        second_call_to_action TEXT NOT NULL,
        second_call_to_action_link TEXT NOT NULL,
        saved_campaign TEXT NOT NULL,
        campaign_name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        audience_min_age INT NOT NULL,
        audience_max_age INT NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'Non-binary')),
        region VARCHAR(100) NOT NULL,
        advert_location VARCHAR(100) NOT NULL,
        language VARCHAR(100) NOT NULL,
        advert_placement VARCHAR(100) NOT NULL CHECK (advert_placement IN ('general', 'notification', 'both')),
        platform VARCHAR(100) NOT NULL CHECK (platform IN ('web', 'ios', 'android', 'all')),
        daily_budget DECIMAL(10, 2) NOT NULL,
        advert_duration INT NOT NULL,
        save_template BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Adverts table created successfully");
  } catch (error) {
    console.error("Error creating adverts table:", error);
  } finally {
    client.release();
  }
};

export default createAdvertTable;
