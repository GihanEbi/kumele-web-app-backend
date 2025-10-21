import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { eventSchema, updateEventSchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { EventCategory } from "../types/types";

const baseUrl = process.env.BASE_URL ?? "";

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
export const getAllEventsService = async () => {
  try {
    // get all events with all the user data as a new array
    const result = await pool.query(`
  SELECT 
    e.*, 
    json_build_object(
      'id', u.id,
      'username', u.username,
      'fullName', u.fullName,
      'email', u.email,
      'gender', u.gender,
      'language', u.language,
      'dateOfBirth', u.dateOfBirth,
      'profilePicture', u.profilePicture,
      'about_me', u.about_me
    ) AS user
  FROM events e
  JOIN users u ON e.user_id = u.id
`);

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
  eventId: string,
  userId: string
): Promise<EventCategory> => {
  // check if eventId is provided
  if (!eventId) {
    return Promise.reject(new Error("Event ID is required"));
  }

  try {
    const result = await pool.query(
      `
  SELECT 
    e.id,
    e.category_id,
    e.event_name,
    e.subtitle,
    e.description,
    e.event_start_in,
    e.event_date,
    e.event_start_time,
    e.event_end_time,
    e.street_address,
    e.home_number,
    e.district,
    e.postal_zip_code,
    e.state,
    e.age_range_min,
    e.age_range_max,
    e.max_guests,
    e.payment_type,
    e.price,
    e.created_at,
    ($2 || REPLACE(e.event_image_url, '\\', '/')) AS event_image_url,
    $3 AS logged_in_user_id, 

    -- host details with following count + average rating
    jsonb_build_object(
      'id', u.id,
      'username', u.username,
      'fullName', u.fullName,
      'about_me', u.about_me,
      'profilePicture', $2 || REPLACE(u."profilepicture", '\\', '/'),
      'following_count', (
        SELECT COUNT(*) 
        FROM following_follower ff 
        WHERE ff.following_id = u.id
      ),
      'host_rating', (
        SELECT COALESCE(ROUND(AVG(ehr.host_rating)::numeric, 1), 0)
        FROM event_host_ratings ehr
        WHERE ehr.host_id = u.id
      )
    ) AS host_details,

    -- participants
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'user_event_id', ue.id,
          'id', uu.id,
          'username', uu.username,
          'profilePicture', $2 || REPLACE(uu."profilepicture", '\\', '/'),
          'status', ue.status
        )
      )
      FROM user_event ue
      JOIN users uu ON ue.user_id = uu.id
      -- WHERE ue.event_id = e.id AND ue.status = 'CONFIRMED'
      WHERE ue.event_id = e.id AND ue.status IN ('CONFIRMED', 'CHECKED_IN')
    ) AS participants

  FROM events e
  JOIN users u ON e.user_id = u.id
  WHERE e.id = $1
  `,
      [eventId, baseUrl.endsWith("/") ? baseUrl : baseUrl + "/", userId]
    );

    if (result.rows.length === 0) {
      return Promise.reject(new Error("Event not found"));
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving event by ID:", error);
    throw new Error("Error retrieving event by ID");
  }
};

// This function updates an event by its ID
export const updateEventByIdService = async (
  eventId: string,
  eventData: Partial<EventCategory>
): Promise<EventCategory> => {
  // check all input data with schema validation in Joi
  let checkData = validation(updateEventSchema, eventData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  // check if the event exists
  const eventCheck = await pool.query(`SELECT * FROM events WHERE id = $1`, [
    eventId,
  ]);
  if (eventCheck.rows.length === 0) {
    return Promise.reject(new Error("Event not found"));
  }

  try {
    const fields = Object.keys(eventData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = [eventId, ...Object.values(eventData)];

    const result = await pool.query(
      `UPDATE events SET ${fields} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating event by ID:", error);
    throw new Error("Error updating event by ID");
  }
};

// check user availability for an event
// export const checkUserAvailabilityForEventService = async (
//   latitude: number | string,
//   longitude: number | string
// ) => {
//   // check if latitude and longitude are provided
//   if (latitude === undefined || longitude === undefined) {
//     return Promise.reject(new Error("Latitude and Longitude are required"));
//   }
//   const lat = parseFloat(latitude as string);
//   const lon = parseFloat(longitude as string);
//   try {
//     const result = await pool.query(
//       "SELECT COUNT(*) AS nearby_users FROM users WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 2000)",
//       [lon, lat]
//     );

//     return result.rows[0].nearby_users;
//   } catch (error) {
//     console.error("Error checking user availability for event:", error);
//     throw new Error("Error checking user availability for event");
//   }
// };


export const checkUserAvailabilityForEventService = async (
  latitude: number | string,
  longitude: number | string
) => {
  if (latitude === undefined || longitude === undefined) {
    throw new Error("Latitude and Longitude are required");
  }

  const lat = parseFloat(latitude as string);
  const lon = parseFloat(longitude as string);

  try {
    // ✅ Use geography type directly (no need for ST_SetSRID or ::geography)
    const result = await pool.query(
      `
      SELECT COUNT(*) AS nearby_users
      FROM users
      WHERE ST_DWithin(
        location,                     -- geography column
        ST_MakePoint($1, $2)::geography,  -- convert to geography point
        2000                          -- 2000 meters
      );
      `,
      [lon, lat] // longitude first, latitude second
    );

    return {
      nearby_users: Number(result.rows[0].nearby_users),
      latitude: lat,
      longitude: lon,
    };
  } catch (error) {
    console.error("❌ Error checking user availability for event:", error);
    throw new Error("Error checking user availability for event");
  }
};
