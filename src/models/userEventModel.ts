import { pool } from "../config/db";
import { EventConstants } from "../constants/eventConstants";
import { id_codes } from "../constants/idCodeConstants";
import { createId } from "../service/idGenerator/idGenerator";

// function for create user event
export const createUserEventService = async (
  userId: string,
  eventId: string
) => {
  // check if userId and eventId are provided
  if (!userId || !eventId) {
    return Promise.reject(new Error("User ID and Event ID are required"));
  }

  // check if the user is in user table
  const userCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  if (userCheck.rows.length === 0) {
    return Promise.reject(new Error("User not found"));
  }

  // check if the event is in events table
  const eventCheck = await pool.query(`SELECT * FROM events WHERE id = $1`, [
    eventId,
  ]);
  if (eventCheck.rows.length === 0) {
    return Promise.reject(new Error("Event not found"));
  }

  try {
    const userEventId = await createId(id_codes.idCode.userEvent);
    const result = await pool.query(
      `INSERT INTO user_event (id, user_id, event_id) VALUES ($1, $2, $3) RETURNING *`,
      [userEventId, userId, eventId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user event:", error);
    throw new Error("Error creating user event");
  }
};

// function to accept user event (update status to CONFIRMED)
export const acceptUserEventService = async (userEventId: string) => {
  // check if userEventId is provided
  if (!userEventId) {
    return Promise.reject(new Error("User Event ID is required"));
  }
  // check if the user event exists
  const userEventCheck = await pool.query(
    `SELECT * FROM user_event WHERE id = $1`,
    [userEventId]
  );
  if (userEventCheck.rows.length === 0) {
    return Promise.reject(new Error("User Event not found"));
  }

  try {
    const result = await pool.query(
      `UPDATE user_event SET status = $1 WHERE id = $2 RETURNING *`,
      [EventConstants.userEventStatus.CONFIRMED, userEventId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error accepting user event:", error);
    throw new Error("Error accepting user event");
  }
};

// function to cancel user event (update status to CANCELLED)
export const cancelUserEventService = async (userEventId: string) => {
  // check if userEventId is provided
  if (!userEventId) {
    return Promise.reject(new Error("User Event ID is required"));
  }

  // check if the user event exists
  const userEventCheck = await pool.query(
    `SELECT * FROM user_event WHERE id = $1`,
    [userEventId]
  );
  if (userEventCheck.rows.length === 0) {
    return Promise.reject(new Error("User Event not found"));
  }

  try {
    const result = await pool.query(
      `UPDATE user_event SET status = $1 WHERE id = $2 RETURNING *`,
      [EventConstants.userEventStatus.CANCELLED, userEventId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error cancelling user event:", error);
    throw new Error("Error cancelling user event");
  }
};

// function to get all pending user events by user id
export const getPendingUserEventsByUserIdService = async (userId: string) => {
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
    // get the pending user events and get event data using event_id of the data
    const result = await pool.query(
      `
  SELECT 
    to_jsonb(ue) AS user_event,
    (to_jsonb(e) || jsonb_build_object('host', to_jsonb(u))) AS event
  FROM user_event ue
  JOIN events e ON ue.event_id = e.id
  JOIN users u ON e.user_id = u.id
  WHERE ue.user_id = $1 AND ue.status = $2
  `,
      [userId, EventConstants.userEventStatus.PENDING]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting pending user events by user ID:", error);
    throw new Error("Error getting pending user events by user ID");
  }
};

// function to get all confirmed user events by user id
export const getConfirmedUserEventsByUserIdService = async (userId: string) => {
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
    // get the confirmed user events and get event data using event_id of the data
    const result = await pool.query(
      `
  SELECT 
    to_jsonb(ue) AS user_event,
    (
      to_jsonb(e)
      || jsonb_build_object(
        'host', jsonb_build_object(
          'id', u.id,
          'username', u.username,
          'about_me', u.about_me,
          'email', u.email,
          'qr_code_url', u.qr_code_url,
          'profilepicture', u.profilepicture,
          'my_referral_code', u.my_referral_code
          -- add other safe fields you want
        ),
        'participants', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', u2.id,
              'username', u2.username,
              'about_me', u2.about_me,
              'email', u2.email,
              'qr_code_url', u2.qr_code_url,
              'profilepicture', u2.profilepicture,
              'my_referral_code', u2.my_referral_code
              -- add other safe fields you want
            )
          )
          FROM user_event ue2
          JOIN users u2 ON ue2.user_id = u2.id
          WHERE ue2.event_id = e.id AND ue2.status = $2
        ),
        'category', to_jsonb(ec)
      )
    ) AS event
  FROM user_event ue
  JOIN events e ON ue.event_id = e.id
  JOIN users u ON e.user_id = u.id   -- host
  JOIN event_categories ec ON e.category_id = ec.id
  WHERE ue.user_id = $1 AND ue.status = $2
  `,
      [userId, EventConstants.userEventStatus.CONFIRMED]
    );

    return result.rows;
  } catch (error) {
    console.error("Error getting confirmed user events by user ID:", error);
    throw new Error("Error getting confirmed user events by user ID");
  }
};

// function to get all cancelled user events by user id
export const getCancelledUserEventsByUserIdService = async (userId: string) => {
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
    // get the cancelled user events and get event data using event_id of the data
    const result = await pool.query(
      `
  SELECT 
    to_jsonb(ue) AS user_event,
    (to_jsonb(e) || jsonb_build_object('host', to_jsonb(u))) AS event
  FROM user_event ue
  JOIN events e ON ue.event_id = e.id
  JOIN users u ON e.user_id = u.id
  WHERE ue.user_id = $1 AND ue.status = $2
  `,
      [userId, EventConstants.userEventStatus.CANCELLED]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting cancelled user events by user ID:", error);
    throw new Error("Error getting cancelled user events by user ID");
  }
};

// function to get all user events by event id
export const getAllUserEventsByEventIdService = async (eventId: string) => {
  // check if eventId is provided
  if (!eventId) {
    return Promise.reject(new Error("Event ID is required"));
  }
  // check if the event is in events table
  const eventCheck = await pool.query(`SELECT * FROM events WHERE id = $1`, [
    eventId,
  ]);
  if (eventCheck.rows.length === 0) {
    return Promise.reject(new Error("Event not found"));
  }
  try {
    // get all user events and get event data using event_id of the data. set it as a separate object call event details
    const result = await pool.query(
      `
  SELECT 
    to_jsonb(ue) AS user_event,
    to_jsonb(e)  AS event
  FROM user_event ue
  JOIN events e ON ue.event_id = e.id
  WHERE ue.event_id = $1
  `,
      [eventId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting all user events by event ID:", error);
    throw new Error("Error getting all user events by event ID");
  }
};

// get all user event data
export const getAllUserEventsService = async () => {
  try {
    const result = await pool.query(`SELECT * FROM user_event`);
    return result.rows;
  } catch (error) {
    console.error("Error getting all user events:", error);
    throw new Error("Error getting all user events");
  }
};
