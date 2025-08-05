import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { eventSchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { EventCategory } from "../types/types";

export const createEventService = async (
  eventData: EventCategory
): Promise<EventCategory> => {
  // check all input data with schema validation in Joi
  let checkData = validation(eventSchema, eventData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  console.log("Event data validated successfully:", eventData);

  try {
    // generate the id for the event
    const eventId = await createId(id_codes.idCode.event);
    eventData.id = eventId;

    // insert the event data into the database
    const result = await pool.query(
      `
          INSERT INTO events (id, user_id, category_id, event_name, subtitle, description, event_start_in, event_date, event_start_time, event_end_time, street_address, home_number, district, postal_zip_code, state, age_range_min, age_range_max, max_guests, payment_type, price,event_image_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          RETURNING *
        `,
      [
        eventData.id,
        eventData.user_id,
        eventData.category_id,
        eventData.event_name,
        eventData.subtitle,
        eventData.description,
        eventData.event_start_in,
        eventData.event_date,
        eventData.event_start_time,
        eventData.event_end_time,
        eventData.street_address,
        eventData.home_number,
        eventData.district,
        eventData.postal_zip_code,
        eventData.state,
        eventData.age_range_min,
        eventData.age_range_max,
        eventData.max_guests,
        eventData.payment_type,
        eventData.price,
        eventData.event_image_url,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Error creating event");
  }
};

// This function retrieves all events from the database
export const getAllEventsService = async (): Promise<EventCategory[]> => {
  try {
    const result = await pool.query(`SELECT * FROM events`);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving events:", error);
    throw new Error("Error retrieving events");
  }
};

// This function retrieves events by user ID
export const getEventByUserIDService = async (
  userId: string
): Promise<EventCategory[]> => {
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
    const result = await pool.query(`SELECT * FROM events WHERE user_id = $1`, [
      userId,
    ]);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving events by user ID:", error);
    throw new Error("Error retrieving events by user ID");
  }
};

// This function retrieves events by category ID
export const getEventByCategoryIDService = async (
  categoryId: string
): Promise<EventCategory[]> => {
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
      `SELECT * FROM events WHERE category_id = $1`,
      [categoryId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error retrieving events by category ID:", error);
    throw new Error("Error retrieving events by category ID");
  }
};

// This function retrieves an event by its ID
export const getEventByIdService = async (
  eventId: string
): Promise<EventCategory> => {
  // check if eventId is provided
  if (!eventId) {
    return Promise.reject(new Error("Event ID is required"));
  }

  try {
    const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      eventId,
    ]);
    if (result.rows.length === 0) {
      return Promise.reject(new Error("Event not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving event by ID:", error);
    throw new Error("Error retrieving event by ID");
  }
};
