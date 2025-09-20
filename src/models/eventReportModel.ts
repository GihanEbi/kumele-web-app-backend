import { pool } from "../config/db";
import { EventConstants } from "../constants/eventConstants";
import { id_codes } from "../constants/idCodeConstants";
import { createId } from "../service/idGenerator/idGenerator";

//  function to get event report reasons
export const getEventReportReasons = () => {
  return EventConstants.eventReportReasonsList;
};

// function for create event report
export const createEventReportService = async (
  user_id: string,
  event_id: string,
  reason: string,
  comments?: string
) => {
  // check if userId, eventId and reason are provided
  if (!user_id || !event_id || !reason) {
    return Promise.reject(new Error("Missing required fields"));
  }
  // check if the reason is valid
  const validReasons = Object.values(EventConstants.eventReportReasons);
  if (!validReasons.includes(reason)) {
    return Promise.reject(new Error("Invalid reason"));
  }

  // check if the user is in user table
  const userCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    user_id,
  ]);
  if (userCheck.rows.length === 0) {
    return Promise.reject(new Error("User not found"));
  }

  // check if the event is in events table
  const eventCheck = await pool.query(`SELECT * FROM events WHERE id = $1`, [
    event_id,
  ]);
  if (eventCheck.rows.length === 0) {
    return Promise.reject(new Error("Event not found"));
  }

  try {
    const id = await createId(id_codes.idCode.eventReport);

    const query = `
            INSERT INTO event_reports (id, event_id, user_id, reason, comments)
            VALUES ($1, $2, $3, $4, $5)
        `;

    await pool.query(query, [id, event_id, user_id, reason, comments]);
    console.log("Event report created successfully.");
  } catch (error) {
    console.error("Error creating event report:", error);
  }
};

// function to get all event reports
export const getAllEventReportsService = async () => {
  try {
    const query = `SELECT * FROM event_reports`;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching event reports:", error);
    throw error;
  }
};

// get event reports by event id
export const getEventReportsByEventIdService = async (eventId: string) => {
  if (!eventId) {
    return Promise.reject(new Error("Missing event ID"));
  }

  try {
    const query = `SELECT * FROM event_reports WHERE event_id = $1`;
    const result = await pool.query(query, [eventId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching event reports by event ID:", error);
    throw error;
  }
};

// get event reports by user id
export const getEventReportsByUserIdService = async (userId: string) => {
  if (!userId) {
    return Promise.reject(new Error("Missing user ID"));
  }
  try {
    const query = `SELECT * FROM event_reports WHERE user_id = $1`;
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching event reports by user ID:", error);
    throw error;
  }
};
