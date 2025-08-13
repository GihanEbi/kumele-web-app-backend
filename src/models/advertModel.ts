import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { createAdvertSchema, updateAdvertSchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { CreateAdvert } from "../types/types";

export const createAdvertService = async (
  advertData: CreateAdvert
): Promise<CreateAdvert> => {
  // check all input data with schema validation in Joi
  let checkData = validation(createAdvertSchema, advertData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  
    console.log(advertData);
  try {
    // check if user available and active user in user table
    const user = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [advertData.user_id]
    );
    if (user.rowCount === 0) {
      const error = new Error("User not found or inactive");
      (error as any).statusCode = 404;
      throw error;
    }

    // check if category available
    const category = await pool.query(
      "SELECT * FROM event_categories WHERE id = $1",
      [advertData.category_id]
    );
    if (category.rowCount === 0) {
      const error = new Error("Category not found");
      (error as any).statusCode = 404;
      throw error;
    }

    
    // create advert id
    const advertId = await createId(id_codes.idCode.advert);

    // insert the advert data into the database
    const result = await pool.query(
        `INSERT INTO adverts (
            id, user_id, category_id, advert_image_type, advert_image_url_1, 
            advert_image_url_2, advert_image_url_3, call_to_action, 
            call_to_action_link, second_call_to_action, second_call_to_action_link, 
            saved_campaign, campaign_name, title, description, audience_min_age, 
            audience_max_age, gender, region, advert_location, language, advert_placement, platform, daily_budget, advert_duration
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`,
        [
            advertId,
            advertData.user_id,
            advertData.category_id,
            advertData.advert_image_type,
            advertData.advert_image_url_1,
            advertData.advert_image_url_2,
            advertData.advert_image_url_3,
            advertData.call_to_action,
            advertData.call_to_action_link,
            advertData.second_call_to_action,
            advertData.second_call_to_action_link,
            advertData.saved_campaign,
            advertData.campaign_name,
            advertData.title,
            advertData.description,
            advertData.audience_min_age,
            advertData.audience_max_age,
            advertData.gender,
            advertData.region,
            advertData.advert_location,
            advertData.language,
            advertData.advert_placement,
            advertData.platform,
            advertData.daily_budget,
            advertData.advert_duration,
        ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Error creating event");
  }
};

// this function retrieves all advert data
export const getAllAdvertsService = async (): Promise<CreateAdvert[]> => {
  try {
    const result = await pool.query("SELECT * FROM adverts");
    return result.rows;
  } catch (error) {
    console.error("Error retrieving adverts:", error);
    throw new Error("Error retrieving adverts");
  }
};

// This function retrieves adverts by user ID
export const getAdvertsByUserIdService = async (
  userId: string
): Promise<CreateAdvert[]> => {
  // check if userId is provided
  if (!userId) {
    return Promise.reject(new Error("User ID is required"));
  }

  // check if the user is in user table
  const userCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  if (userCheck.rows.length === 0) {
    return Promise.reject(new Error("User not found"));
  }
  try {
    const result = await pool.query(
      "SELECT * FROM adverts WHERE user_id = $1",
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error retrieving adverts by user ID:", error);
    throw new Error("Error retrieving adverts by user ID");
  }
};
// This function retrieves advert by category ID
export const getAdvertsByCategoryIdService = async (
  categoryId: string
): Promise<CreateAdvert[]> => {
  // check if categoryId is provided
  if (!categoryId) {
    return Promise.reject(new Error("Category ID is required"));
  }
  // check if the category is in categories table
  const categoryCheck = await pool.query(
    `SELECT * FROM event_categories WHERE id = $1`,
    [categoryId]
  );
  if (categoryCheck.rows.length === 0) {
    return Promise.reject(new Error("Category not found"));
  }
  try {
    const result = await pool.query(
      "SELECT * FROM adverts WHERE category_id = $1",
      [categoryId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error retrieving adverts by category ID:", error);
    throw new Error("Error retrieving adverts by category ID");
  }
};
// This function retrieves an advert by its ID
export const getAdvertByIdService = async (
  advertId: string
): Promise<CreateAdvert | null> => {
  // check if advertId is provided
  if (!advertId) {
    return Promise.reject(new Error("Advert ID is required"));
  }
  try {
    const result = await pool.query("SELECT * FROM adverts WHERE id = $1", [
      advertId,
    ]);
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving advert by ID:", error);
    throw new Error("Error retrieving advert by ID");
  }
};

// This function updates an advert by its ID
export const updateAdvertByIdService = async (
  advertId: string,
  advertData: Partial<CreateAdvert>
): Promise<CreateAdvert | null> => {
  // check if advertId is provided
  if (!advertId) {
    return Promise.reject(new Error("Advert ID is required"));
  }
  // check all input data with schema validation in Joi
  let checkData = validation(updateAdvertSchema, advertData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  // check if advert exists
  const advertCheck = await pool.query("SELECT * FROM adverts WHERE id = $1", [
    advertId,
  ]);
  if (advertCheck.rows.length === 0) {
    return Promise.reject(new Error("Advert not found"));
  }

  try {
    const fields = Object.keys(advertData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = [advertId, ...Object.values(advertData)];

    const result = await pool.query(
      `UPDATE adverts SET ${fields} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating advert by ID:", error);
    throw new Error("Error updating advert by ID");
  }
};
