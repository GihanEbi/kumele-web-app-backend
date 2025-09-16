import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import {
  createNotificationSchema,
  createUserAppNotificationSchema,
} from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { NotificationType, UserAppNotification } from "../types/types";

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
      "INSERT INTO notification (id, title, message, type, created_by,event_category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        id,
        notificationData.title,
        notificationData.message,
        notificationData.type,
        notificationData.created_by,
        notificationData.event_category_id,
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
    // create unique id for user app notification
    const id = await createId(id_codes.idCode.userAppNotification);

    // insert the user app notification data into the database
    const result = await pool.query(
      "INSERT INTO user_app_notification (id, user_id, notification_id, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        id,
        userAppNotificationData.user_id,
        userAppNotificationData.notification_id,
        userAppNotificationData.status,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user app notification:", error);
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
