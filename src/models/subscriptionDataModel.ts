import { pool } from "../config/db";
import { SubscriptionData } from "../types/types";
import { id_codes } from "../constants/idCodeConstants";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { subscriptionDataSchema } from "../lib/schemas/schemas";

export const createSubscription = async (
  data: SubscriptionData
): Promise<SubscriptionData> => {
  // check all user data with schema validation in Joi
  let checkData = validation(subscriptionDataSchema, data);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  try {
    const newId = await createId(id_codes.idCode.subscription);
    const query = `
        INSERT INTO subscription_data (id, icon_code, title, description, price, validity_period)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      newId,
      data.icon_code,
      data.title,
      data.description,
      data.price,
      data.validity_period,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

// get all subscriptions
export const getAllSubscriptions = async (): Promise<SubscriptionData[]> => {
  try {
    const query = `
        SELECT * FROM subscription_data
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
};

// get subscription by id
export const getSubscriptionById = async (
  id: string
): Promise<SubscriptionData | null> => {
  try {
    const query = `
        SELECT * FROM subscription_data WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching subscription by ID:", error);
    throw error;
  }
};

// update subscription by id
export const updateSubscriptionById = async (
  id: string,
  data: Partial<SubscriptionData>
): Promise<SubscriptionData | null> => {
  // check all user data with schema validation in Joi
  let checkData = validation(subscriptionDataSchema, data);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  try {
    const query = `
        UPDATE subscription_data
        SET icon_code = $1, title = $2, description = $3, price = $4, validity_period = $5
        WHERE id = $6
        RETURNING *
    `;
    const values = [
      data.icon_code,
      data.title,
      data.description,
      data.price,
      data.validity_period,
      id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error updating subscription by ID:", error);
    throw error;
  }
};
