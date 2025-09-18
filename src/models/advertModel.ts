import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { createAdvertSchema, updateAdvertSchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { CreateAdvert } from "../types/types";

export const createAdvertService = async ({
  user_id,
  advertData,
}: {
  user_id: string;
  advertData: CreateAdvert;
}): Promise<CreateAdvert> => {
  // check all input data with schema validation in Joi
  let checkData = validation(createAdvertSchema, advertData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  try {
    // check if user available and active user in user table
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      user_id,
    ]);
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
        id, user_id, category_id, advert_image_type, advert_image_url_1, advert_image_url_2, advert_image_url_3,
        call_to_action, call_to_action_link, second_call_to_action, second_call_to_action_link,
        campaign_name, title, description, audience_min_age, audience_max_age, gender, region, advert_location, language, advert_placement, platform, daily_budget_type, daily_budget, advert_duration, save_template
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)`,
      [
        advertId,
        user_id,
        advertData.category_id,
        advertData.advert_image_type,
        advertData.advert_image_url_1,
        advertData.advert_image_url_2,
        advertData.advert_image_url_3,
        advertData.call_to_action,
        advertData.call_to_action_link,
        advertData.second_call_to_action,
        advertData.second_call_to_action_link,
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
        advertData.daily_budget_type,
        advertData.daily_budget,
        advertData.advert_duration,
        advertData.save_template,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Error creating event");
  }
};

// get saved advert id by user id and return array with advert id and advert name
export const getSavedAdvertsByUserIdService = async (
  userId: string
): Promise<{ label: string; value: string }[]> => {
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
    // get all advert id and title where user_id is userId and save_template is true
    const result = await pool.query(
      "SELECT id, campaign_name FROM adverts WHERE user_id = $1 AND save_template = true",
      [userId]
    );
    return result.rows.map((row) => ({
      label: row.campaign_name,
      value: row.id,
    }));
  } catch (error) {
    console.error("Error retrieving saved adverts by user ID:", error);
    throw new Error("Error retrieving saved adverts by user ID");
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

// ================ advert other function for admin ==================
// advert region creation function
export const createAdvertRegionService = async (regionData: {
  name: string;
}): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
}> => {
  // check if regionData is provided
  if (!regionData || !regionData.name) {
    return Promise.reject(new Error("Region data is required"));
  }

  try {
    // create unique id for region
    const id = await createId(id_codes.idCode.advertRegion);
    // insert the region data into the database
    const result = await pool.query(
      "INSERT INTO advert_region (id, name) VALUES ($1, $2) RETURNING *",
      [id, regionData.name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating advert region:", error);
    throw new Error("Error creating advert region");
  }
};

// get all advert regions function
export const getAllAdvertRegionsService = async (): Promise<
  { label: string; value: string }[]
> => {
  try {
    const result = await pool.query("SELECT * FROM advert_region"); // reshape result with label and value with only is_active true

    return result.rows
      .filter((row) => row.is_active)
      .map((row) => ({
        label: row.name,
        value: row.id,
      }));
  } catch (error) {
    console.error("Error retrieving all advert regions:", error);
    throw new Error("Error retrieving all advert regions");
  }
};

// get advert region by id function
export const getAdvertRegionByIdService = async (
  regionId: string
): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if regionId is provided
  if (!regionId) {
    return Promise.reject(new Error("Region ID is required"));
  }
  try {
    const result = await pool.query(
      "SELECT * FROM advert_region WHERE id = $1",
      [regionId]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert region not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving advert region by ID:", error);
    throw new Error("Error retrieving advert region by ID");
  }
};

// update advert region by id function
export const updateAdvertRegionByIdService = async (
  regionId: string,
  regionData: Partial<{ name: string; is_active: boolean }>
): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if regionId is provided
  if (!regionId) {
    return Promise.reject(new Error("Region ID is required"));
  }

  // check if regionData is provided
  if (!regionData) {
    return Promise.reject(new Error("Region data is required"));
  }

  try {
    const result = await pool.query(
      "UPDATE advert_region SET name = $1, is_active = $2 WHERE id = $3 RETURNING *",
      [regionData.name, regionData.is_active, regionId]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert region not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating advert region by ID:", error);
    throw new Error("Error updating advert region by ID");
  }
};

// ======= advert language function =======
// create advert language function
export const createAdvertLanguageService = async (languageData: {
  name: string;
}): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
}> => {
  // check if languageData is provided
  if (!languageData || !languageData.name) {
    return Promise.reject(new Error("Language data is required"));
  }

  try {
    // create unique id for language
    const id = await createId(id_codes.idCode.advertLanguage);
    // insert the language data into the database
    const result = await pool.query(
      "INSERT INTO advert_languages (id, name) VALUES ($1, $2) RETURNING *",
      [id, languageData.name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating advert language:", error);
    throw new Error("Error creating advert language");
  }
};

// get all advert languages function
export const getAllAdvertLanguagesService = async (): Promise<
  { label: string; value: string }[]
> => {
  try {
    const result = await pool.query("SELECT * FROM advert_languages");
    // reshape result with label and value with only is_active true
    return result.rows
      .filter((row) => row.is_active)
      .map((row) => ({
        label: row.name,
        value: row.id,
      }));
  } catch (error) {
    console.error("Error retrieving all advert languages:", error);
    throw new Error("Error retrieving all advert languages");
  }
};

// get advert language by id function
export const getAdvertLanguageByIdService = async (
  languageId: string
): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if languageId is provided
  if (!languageId) {
    return Promise.reject(new Error("Language ID is required"));
  }
  try {
    const result = await pool.query(
      "SELECT * FROM advert_languages WHERE id = $1",
      [languageId]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert language not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving advert language by ID:", error);
    throw new Error("Error retrieving advert language by ID");
  }
};

// update advert language by id function
export const updateAdvertLanguageByIdService = async (
  languageId: string,
  languageData: Partial<{ name: string; is_active: boolean }>
): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if languageId is provided
  if (!languageId) {
    return Promise.reject(new Error("Language ID is required"));
  }

  // check if languageData is provided
  if (!languageData) {
    return Promise.reject(new Error("Language data is required"));
  }

  try {
    const result = await pool.query(
      "UPDATE advert_languages SET name = $1, is_active = $2 WHERE id = $3 RETURNING *",
      [languageData.name, languageData.is_active, languageId]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert language not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating advert language by ID:", error);
    throw new Error("Error updating advert language by ID");
  }
};

// ================ advert daily budget function ==================
// crete advert daily budget function
export const createAdvertDailyBudgetService = async (budgetData: {
  name: string;
}): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
}> => {
  // check if budgetData is provided
  if (!budgetData || !budgetData.name) {
    return Promise.reject(new Error("Budget data is required"));
  }

  try {
    // create unique id for budget
    const id = await createId(id_codes.idCode.advertDailyBudget);
    // insert the budget data into the database
    const result = await pool.query(
      "INSERT INTO advert_daily_budget (id, name) VALUES ($1, $2) RETURNING *",
      [id, budgetData.name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating advert daily budget:", error);
    throw new Error("Error creating advert daily budget");
  }
};

// get all advert daily budgets function
export const getAllAdvertDailyBudgetsService = async (): Promise<
  { label: string; value: string }[]
> => {
  try {
    const result = await pool.query("SELECT * FROM advert_daily_budget");
    // reshape result with label and value with only is_active true
    return result.rows
      .filter((row) => row.is_active)
      .map((row) => ({
        value: row.id,
        label: row.name,
      }));
  } catch (error) {
    console.error("Error retrieving all advert daily budgets:", error);
    throw new Error("Error retrieving all advert daily budgets");
  }
};

// get advert daily budget by id function
export const getAdvertDailyBudgetByIdService = async (
  budgetId: string
): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if budgetId is provided
  if (!budgetId) {
    return Promise.reject(new Error("Budget ID is required"));
  }

  try {
    const result = await pool.query(
      "SELECT * FROM advert_daily_budget WHERE id = $1",
      [budgetId]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert daily budget not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving advert daily budget by ID:", error);
    throw new Error("Error retrieving advert daily budget by ID");
  }
};

// update advert daily budget by id function
export const updateAdvertDailyBudgetByIdService = async (
  budgetId: string,
  budgetData: Partial<{ name: string; is_active: boolean }>
): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if budgetId is provided
  if (!budgetId) {
    return Promise.reject(new Error("Budget ID is required"));
  }

  // check if budgetData is provided
  if (!budgetData) {
    return Promise.reject(new Error("Budget data is required"));
  }

  try {
    const result = await pool.query(
      "UPDATE advert_daily_budget SET name = $1, is_active = $2 WHERE id = $3 RETURNING *",
      [budgetData.name, budgetData.is_active, budgetId]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert daily budget not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating advert daily budget by ID:", error);
    throw new Error("Error updating advert daily budget by ID");
  }
};

// ====== call to action functions ======
// create call to action function
export const createAdvertCallToActionService = async (ctaData: {
  name: string;
}): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
}> => {
  // check if ctaData is provided
  if (!ctaData || !ctaData.name) {
    return Promise.reject(new Error("Call to action data is required"));
  }

  try {
    // create unique id for call to action
    const id = await createId(id_codes.idCode.advertCallToAction);
    // insert the call to action data into the database
    const result = await pool.query(
      "INSERT INTO advert_call_to_actions (id, name) VALUES ($1, $2) RETURNING *",
      [id, ctaData.name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating advert call to action:", error);
    throw new Error("Error creating advert call to action");
  }
};

// get all advert call to actions function
export const getAllAdvertCallToActionsService = async (): Promise<
  { label: string; value: string }[]
> => {
  try {
    const result = await pool.query("SELECT * FROM advert_call_to_actions");
    // reshape result with label and value with only is_active true
    return result.rows
      .filter((row) => row.is_active)
      .map((row) => ({
        label: row.name,
        value: row.id,
      }));
  } catch (error) {
    console.error("Error retrieving all advert call to actions:", error);
    throw new Error("Error retrieving all advert call to actions");
  }
};

// get advert call to action by id function
export const getAdvertCallToActionByIdService = async (
  ctaId: string
): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if ctaId is provided
  if (!ctaId) {
    return Promise.reject(new Error("Call to action ID is required"));
  }

  try {
    const result = await pool.query(
      "SELECT * FROM advert_call_to_actions WHERE id = $1",
      [ctaId]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert call to action not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving advert call to action by ID:", error);
    throw new Error("Error retrieving advert call to action by ID");
  }
};

// update advert call to action by id function
export const updateAdvertCallToActionByIdService = async (
  ctaId: string,
  ctaData: Partial<{ name: string; is_active: boolean }>
): Promise<{
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if ctaId is provided
  if (!ctaId) {
    return Promise.reject(new Error("Call to action ID is required"));
  }

  // check if ctaData is provided
  if (!ctaData) {
    return Promise.reject(new Error("Call to action data is required"));
  }

  try {
    const result = await pool.query(
      "UPDATE advert_call_to_actions SET name = $1, is_active = $2 WHERE id = $3 RETURNING *",
      [ctaData.name, ctaData.is_active, ctaId]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert call to action not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating advert call to action by ID:", error);
    throw new Error("Error updating advert call to action by ID");
  }
};

// ====== advert placement price functions ======
// create advert placement price function
export const createAdvertPlacementPriceService = async (priceData: {
  name: string;
  price: number;
  description?: string;
}): Promise<{
  id: string;
  name: string;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: Date;
}> => {
  // check if priceData is provided
  if (!priceData || !priceData.name || !priceData.price) {
    return Promise.reject(new Error("Advert placement price data is required"));
  }

  try {
    // create unique id for advert placement price
    const id = await createId(id_codes.idCode.advertPlacementPrice);
    // insert the advert placement price data into the database
    const result = await pool.query(
      "INSERT INTO advert_placement_prices (id, name, price, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, priceData.name, priceData.price, priceData.description]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating advert placement price:", error);
    throw new Error("Error creating advert placement price");
  }
};

// get all advert placement prices function
export const getAllAdvertPlacementPricesService = async (): Promise<
  { label: string; value: string }[]
> => {
  try {
    const result = await pool.query("SELECT * FROM advert_placement_prices");
    // reshape result with label and value with only is_active true
    return result.rows
      .filter((row) => row.is_active)
      .map((row) => ({
        label: row.name,
        value: row.id,
      }));
  } catch (error) {
    console.error("Error retrieving all advert placement prices:", error);
    throw new Error("Error retrieving all advert placement prices");
  }
};

// get advert placement by id function
export const getAdvertPlacementPriceByIdService = async (
  priceId: string
): Promise<{
  id: string;
  name: string;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if priceId is provided
  if (!priceId) {
    return Promise.reject(new Error("Advert placement price ID is required"));
  }

  try {
    const result = await pool.query(
      "SELECT * FROM advert_placement_prices WHERE id = $1",
      [priceId]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert placement price not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving advert placement price by ID:", error);
    throw new Error("Error retrieving advert placement price by ID");
  }
};

// update advert placement price by id function
export const updateAdvertPlacementPriceByIdService = async (
  priceId: string,
  priceData: Partial<{
    name: string;
    price: number;
    description?: string;
    is_active: boolean;
  }>
): Promise<{
  id: string;
  name: string;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  // check if priceId is provided
  if (!priceId) {
    return Promise.reject(new Error("Advert placement price ID is required"));
  }

  // check if priceData is provided
  if (!priceData) {
    return Promise.reject(new Error("Advert placement price data is required"));
  }

  try {
    const result = await pool.query(
      "UPDATE advert_placement_prices SET name = $1, price = $2, description = $3, is_active = $4 WHERE id = $5 RETURNING *",
      [
        priceData.name,
        priceData.price,
        priceData.description,
        priceData.is_active,
        priceId,
      ]
    );
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Advert placement price not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating advert placement price by ID:", error);
    throw new Error("Error updating advert placement price by ID");
  }
};
