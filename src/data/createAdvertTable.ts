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
        call_to_action TEXT NOT NULL REFERENCES advert_call_to_actions(id),
        call_to_action_link TEXT NOT NULL,
        second_call_to_action TEXT NOT NULL,
        second_call_to_action_link TEXT NOT NULL,
        campaign_name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        audience_min_age INT NOT NULL,
        audience_max_age INT NOT NULL,
        gender TEXT[] NOT NULL CHECK (gender <@ ARRAY['male', 'female', 'other']),
        region VARCHAR(100) NOT NULL REFERENCES advert_region(id),
        advert_location TEXT[] NOT NULL,
        language VARCHAR(100) NOT NULL REFERENCES advert_languages(id),
        advert_placement VARCHAR(100) NOT NULL REFERENCES advert_placement_prices(id),
        platform TEXT[] NOT NULL CHECK (platform <@ ARRAY['web', 'ios', 'android', 'all']),
        daily_budget_type VARCHAR(10) NOT NULL REFERENCES advert_daily_budget(id),
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
