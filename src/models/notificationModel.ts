import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import {
  createNotificationSchema,
  createUserAppNotificationSchema,
} from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { NotificationType, UserAppNotification } from "../types/types";

const baseUrl = process.env.BASE_URL ?? "";

export const createNotification = async (
  notificationData: NotificationType
) => {
  let checkData = validation(createNotificationSchema, notificationData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  try {
    // create unique id for notification
    const id = await createId(id_codes.idCode.notification);

    // insert the notification data into the database
    const result = await pool.query(
      "INSERT INTO notification (id, title, message, type, event_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        id,
        notificationData.title,
        notificationData.message,
        notificationData.type,
        notificationData.event_id,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// create user app notification
export const createUserAppNotification = async (
  userAppNotificationData: UserAppNotification
) => {
  let checkData = validation(
    createUserAppNotificationSchema,
    userAppNotificationData
  );
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  try {
    // insert the user app notification data into the database
    const result = await pool.query(
      "INSERT INTO user_app_notification (user_id, notification_id) VALUES ($1, $2) RETURNING *",
      [userAppNotificationData.user_id, userAppNotificationData.notification_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user app notification:", error);
    throw error;
  }
};

// update user app notification status
export const updateUserAppNotificationStatus = async (
  userId: string,
  notificationId: string,
  status: string
) => {
  // status should be either 'READ' or 'UNREAD'
  if (status !== "READ" && status !== "UNREAD") {
    const error = new Error("Status must be either 'READ' or 'UNREAD'");
    (error as any).statusCode = 400;
    throw error;
  }
  // check userId and notificationId are not empty
  if (!userId || !notificationId) {
    const error = new Error("User ID and Notification ID are required");
    (error as any).statusCode = 400;
    throw error;
  }

  // check if the user app notification exists
  const checkResult = await pool.query(
    "SELECT * FROM user_app_notification WHERE user_id = $1 AND notification_id = $2",
    [userId, notificationId]
  );
  if (checkResult.rows.length === 0) {
    const error = new Error("User App Notification not found");
    (error as any).statusCode = 404;
    throw error;
  }

  try {
    const result = await pool.query(
      "UPDATE user_app_notification SET status = $1 WHERE user_id = $2 AND notification_id = $3 RETURNING *",
      [status, userId, notificationId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user app notification status:", error);
    throw error;
  }
};

// get created event notifications by user id
export const getNotificationsByUserId = async (userId: string) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notification WHERE created_by = $1",
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting notifications by user id:", error);
    throw error;
  }
};

// get all unread notifications count without type == 'CHAT_NOTIFICATIONS' by user id
export const getAllUnreadNotificationsCountByUserId = async (
  userId: string
) => {
  try {
    const query = `
    SELECT COUNT(*) AS unread_count
    FROM user_app_notification uan
    JOIN notification n ON uan.notification_id = n.id
    WHERE uan.user_id = $1
      AND uan.status = 'UNREAD'
      AND n.type != 'CHAT_NOTIFICATIONS';
  `;
    const result = await pool.query(query, [userId]);
    return result.rows[0].unread_count;
  } catch (error) {
    console.error(
      "Error getting all unread notifications count by user id:",
      error
    );
    throw error;
  }
};

// get match hobbies notifications by user id
export const getMatchHobbiesNotificationsByUserId = async (userId: string) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM user_app_notification uan
      JOIN notification n ON uan.notification_id = n.id
      WHERE uan.user_id = $1
        AND n.type = 'MATCH_HOBBIES'
    `,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error(
      "Error getting match hobbies notifications by user id:",
      error
    );
    throw error;
  }
};

// get create hobbies notifications by user id
export const getCreateHobbiesNotificationsByUserId = async (userId: string) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        uan.*,
        n.id AS notification_id,
        n.type,
        n.title,
        n.message,
        n.event_id,
        n.created_at AS notification_created_at,
        json_build_object(
          'id', e.id,
          'user_id', e.user_id,
          'category_id', e.category_id,
          'event_image_url', CONCAT($2::text, REPLACE(e.event_image_url, '\\', '/')),
          'event_name', e.event_name,
          'subtitle', e.subtitle,
          'description', e.description,
          'event_start_in', e.event_start_in,
          'event_date', e.event_date,
          'event_start_time', e.event_start_time,
          'event_end_time', e.event_end_time,
          'street_address', e.street_address,
          'home_number', e.home_number,
          'district', e.district,
          'postal_zip_code', e.postal_zip_code,
          'state', e.state,
          'age_range_min', e.age_range_min,
          'age_range_max', e.age_range_max,
          'max_guests', e.max_guests,
          'payment_type', e.payment_type,
          'price', e.price,
          'created_at', e.created_at,
          'host', json_build_object(
              'username', u.username,
              'profilePicture', CONCAT($2::text, REPLACE(u.profilePicture, '\\', '/'))
          )
        ) AS event
      FROM user_app_notification uan
      JOIN notification n ON uan.notification_id = n.id
      LEFT JOIN events e ON n.event_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE uan.user_id = $1
        AND n.type = 'CREATE_HOBBIES'
      ORDER BY uan.created_at DESC
      `,
      [userId, baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"]
    );
    return result.rows;
  } catch (error) {
    console.error(
      "Error getting create hobbies notifications by user id:",
      error
    );
    throw error;
  }
};
