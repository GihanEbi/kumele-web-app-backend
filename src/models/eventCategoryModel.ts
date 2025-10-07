// src/models/hobbyModel.ts
import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { createEventCategorySchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { CreateEventCategory } from "../types/types";

export const createEventCategoryService = async (
  eventCategoryData: CreateEventCategory
): Promise<CreateEventCategory> => {
  // check all user data with schema validation in Joi
  let checkData = validation(createEventCategorySchema, eventCategoryData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  try {
    // generate the id for the event category
    const eventCategoryId = await createId(id_codes.idCode.eventCategory);
    const query = `
            INSERT INTO event_categories (id, name, svg_code)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    const result = await pool.query(query, [
      eventCategoryId,
      eventCategoryData.name,
      eventCategoryData.svg_code,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error in createEventCategoryService:", error);
    throw new Error("Failed to create event category in the database.");
  }
};

export const getEventCategoriesList = async (): Promise<
  CreateEventCategory[]
> => {
  try {
    const result = await pool.query(`
            SELECT * FROM event_categories
        `);

    // remove created_at field from the result
    result.rows.forEach((row) => {
      delete row.created_at;
    });
    return result.rows;
  } catch (error) {
    console.error("Error in getEventCategoriesList:", error);
    throw new Error("Failed to fetch event categories from the database.");
  }
};

// update event category by id
export const updateEventCategoryById = async (
  categoryId: string,
  eventCategoryData: CreateEventCategory
): Promise<CreateEventCategory | null> => {
  // check all user data with schema validation in Joi
  let checkData = validation(createEventCategorySchema, eventCategoryData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  try {
    const query = `
            UPDATE event_categories
            SET name = $1, svg_code = $2, icon_dark_img_url = $3, icon_light_img_url = $4
            WHERE id = $5
            RETURNING *;
        `;
    const result = await pool.query(query, [
      eventCategoryData.name,
      eventCategoryData.svg_code,
      eventCategoryData.icon_dark_img_url,
      eventCategoryData.icon_light_img_url,
      categoryId,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error in updateEventCategoryById:", error);
    throw new Error("Failed to update event category in the database.");
  }
};
