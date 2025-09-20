import { pool } from "../config/db";
import { EventConstants } from "../constants/eventConstants";
import { id_codes } from "../constants/idCodeConstants";
import { createId } from "../service/idGenerator/idGenerator";

// function for create event host rating
export const createEventHostRatingService = async (
  userId: string,
  eventId: string,
  hostId: string,
  event_rating: number,
  host_rating: number,
  review?: string
) => {
  // check if userId, eventId, hostId and rating are provided
  if (!userId || !eventId || !hostId || !event_rating || !host_rating) {
    return Promise.reject(
      new Error("User ID, Event ID, Host ID and Ratings are required")
    );
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

  // check if the host is in users table
  const hostCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    hostId,
  ]);
  if (hostCheck.rows.length === 0) {
    return Promise.reject(new Error("Host not found"));
  }
  // check if the rating is between 1 and 5
  if (event_rating < 1 || event_rating > 5 || host_rating < 1 || host_rating > 5) {
    return Promise.reject(new Error("Rating must be between 1 and 5"));
  }
  try {
    // if already have event id and user id then update the rating and review else create new one
    const existingRating = await pool.query(
      `SELECT * FROM event_host_ratings WHERE event_id = $1 AND creator_id = $2`,
      [eventId, userId]
    );

    if (existingRating.rows.length > 0) {
      // Update existing rating
      const result = await pool.query(
        `UPDATE event_host_ratings SET event_rating = $1, host_rating = $2, review = $3 WHERE id = $4 RETURNING *`,
        [event_rating, host_rating, review, existingRating.rows[0].id]
      );
      return result.rows[0];
    } else {
      // Create new rating
      const eventHostRatingId = await createId(id_codes.idCode.eventHostRating);
      const result = await pool.query(
        `INSERT INTO event_host_ratings (id, creator_id, event_id, host_id, event_rating, host_rating, review) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [eventHostRatingId, userId, eventId, hostId, event_rating, host_rating, review]
      );
      return result.rows[0];
    }
  } catch (error) {
    console.error("Error creating event host rating:", error);
    throw new Error("Error creating event host rating");
  }
};

// function to get all ratings for a host along with average rating
export const getHostRatingsService = async (hostId: string) => {
  if (!hostId) {
    return Promise.reject(new Error("Host ID is required"));
  }

  try {
    const result = await pool.query(
      `
  SELECT 
    host_id, 
    ROUND(AVG(host_rating)::numeric, 1) AS average_rating
  FROM event_host_ratings
  WHERE host_id = $1
  GROUP BY host_id
  `,
      [hostId]
    );

    return result.rows;
  } catch (error) {
    console.error("Error getting host ratings:", error);
    throw new Error("Error getting host ratings");
  }
};

// function to get average rating for event
export const getEventAverageRatingService = async (eventId: string) => {
  if (!eventId) {
    return Promise.reject(new Error("Event ID is required"));
  }

  try {
    const result = await pool.query(
      `
      SELECT ROUND(AVG(event_rating)::numeric, 1) AS average_rating
      FROM event_host_ratings
      WHERE event_id = $1
      `,
      [eventId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error getting event average rating:", error);
    throw new Error("Error getting event average rating");
  }
};
// function to get all ratings given by a user
export const getUserGivenRatingsService = async (userId: string) => {
  if (!userId) {
    return Promise.reject(new Error("User ID is required"));
  }

  try {
    const result = await pool.query(
      `SELECT * FROM event_host_ratings WHERE creator_id = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting user given ratings:", error);
    throw new Error("Error getting user given ratings");
  }
};
// function to get all ratings received by a host
export const getHostReceivedRatingsService = async (hostId: string) => {
  if (!hostId) {
    return Promise.reject(new Error("Host ID is required"));
  }

  try {
    const result = await pool.query(
      `SELECT * FROM event_host_ratings WHERE host_id = $1`,
      [hostId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting host received ratings:", error);
    throw new Error("Error getting host received ratings");
  }
};
// function to get all ratings for an event
export const getEventRatingsService = async (eventId: string) => {
  if (!eventId) {
    return Promise.reject(new Error("Event ID is required"));
  }

  try {
    const result = await pool.query(
      `SELECT * FROM event_host_ratings WHERE event_id = $1`,
      [eventId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting event ratings:", error);
    throw new Error("Error getting event ratings");
  }
};
