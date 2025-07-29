import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { UserConstants } from "../constants/userConstants";
import {
  loginSchema,
  permissionSchema,
  updateUserNameSchema,
  userRegistrationSchema,
} from "../lib/schemas/schemas";
import { generateToken } from "../service/authService/authService";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { User } from "../types/types";
import { comparePassword, hashPassword } from "../utils/hashUtils";

export const registerUserService = async (userData: User): Promise<User> => {
  // check all user data with schema validation in Joi
  let checkData = validation(userRegistrationSchema, userData);
  if (checkData !== null) {
    return Promise.reject(`Invalid user data: ${JSON.stringify(checkData)}`);
  }

  // check if the email already exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [userData.email]
  );
  if (existingUser.rows.length > 0) {
    return Promise.reject(`Email already exists: ${userData.email}`);
  }

  // check if the gender only contain the gender constants values
  if (!Object.values(UserConstants.gender).includes(userData.gender)) {
    return Promise.reject(`Invalid gender: ${userData.gender}`);
  }

  // check if the language only contain the language constants values
  if (!Object.values(UserConstants.language).includes(userData.language)) {
    return Promise.reject(`Invalid language: ${userData.language}`);
  }

  try {
    // generate the id for the user
    const userId = await createId(id_codes.idCode.user);
    userData.ID = userId;

    // hash the user password
    userData.password = await hashPassword(userData.password);

    const result = await pool.query(
      "INSERT INTO users (ID, fullName, email, password, gender, language, dateOfBirth,referralCode,aboveLegalAge,termsAndConditionsAccepted, subscribedToNewsletter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        userData.ID,
        userData.fullName,
        userData.email,
        userData.password,
        userData.gender,
        userData.language,
        userData.dateOfBirth,
        userData.referralCode,
        userData.aboveLegalAge,
        userData.termsAndConditionsAccepted,
        userData.subscribedToNewsletter,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Error registering user");
  }
};

export const loginUserService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  // check if email and password with schema
  let checkData = validation(loginSchema, { email, password });
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  // check if the email exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (existingUser.rows.length === 0) {
    const error = new Error(`User not found: ${email}`);
    (error as any).statusCode = 404;
    throw error;
  }

  // check if the password is correct
  const isPasswordValid = await comparePassword(
    password,
    existingUser.rows[0].password
  );
  if (!isPasswordValid) {
    const error = new Error("Invalid password");
    (error as any).statusCode = 401;
    throw error;
  }

  const token = generateToken(existingUser.rows[0].id);

  return {
    ...existingUser.rows[0],
    token,
  } as User;
};

// function for create or update user permissions
export const createOrUpdateUserPermissionsService = async (
  userId: string,
  permissions: {
    allow_notifications: boolean;
    allow_photos: string;
    allow_location: string;
  }
): Promise<void> => {
  // validate permissions with schema
  let checkData = validation(permissionSchema, permissions);
  if (checkData !== null) {
    return Promise.reject(
      `Invalid permissions data: ${JSON.stringify(checkData)}`
    );
  }

  // check if the user exists
  const existingUser = await pool.query("SELECT * FROM users WHERE ID = $1", [
    userId,
  ]);

  if (existingUser.rows.length === 0) {
    const error = new Error(`User not found: ${userId}`);
    (error as any).statusCode = 404;
    throw error;
  }

  try {
    // first check if the user id already in the table, then update the data, else add new data
    const existingPermission = await pool.query(
      "SELECT * FROM permissions WHERE user_id = $1",
      [userId]
    );
    if (existingPermission.rows.length > 0) {
      // update the existing permission
      await pool.query(
        "UPDATE permissions SET allow_notifications = $1, allow_photos = $2, allow_location = $3 WHERE user_id = $4",
        [
          permissions.allow_notifications,
          permissions.allow_photos,
          permissions.allow_location,
          userId,
        ]
      );
    } else {
      // insert new permission
      await pool.query(
        "INSERT INTO permissions (user_id, allow_notifications, allow_photos, allow_location) VALUES ($1, $2, $3, $4)",
        [
          userId,
          permissions.allow_notifications,
          permissions.allow_photos,
          permissions.allow_location,
        ]
      );
    }
    // User permissions created or updated successfully
  } catch (error) {
    console.error("Error creating or updating user permissions:", error);
    throw new Error("Error creating or updating user permissions");
  }
};

// function to set user name
export const setUserNameService = async (
  userId: string,
  action: "save" | "skip",
  username?: string
): Promise<void> => {
  // validate input with schema
  let checkData = validation(updateUserNameSchema, { action, username });
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  // validate action with UserConstants
  if (!Object.values(UserConstants.setUserNameAction).includes(action)) {
    const error = new Error(`Invalid action: ${action}`);
    (error as any).statusCode = 400;
    throw error;
  }

  // check if the user exists
  const existingUser = await pool.query("SELECT * FROM users WHERE ID = $1", [
    userId,
  ]);

  if (existingUser.rows.length === 0) {
    const error = new Error(`User not found: ${userId}`);
    (error as any).statusCode = 404;
    throw error;
  }

  try {
    if (action === UserConstants.setUserNameAction.SAVE && !username) {
      const error = new Error("Username is required when action is 'save'");
      (error as any).statusCode = 400;
      throw error;
    }

    // update the username or skip
    if (action === UserConstants.setUserNameAction.SAVE) {
      await pool.query("UPDATE users SET username = $1 WHERE ID = $2", [
        username,
        userId,
      ]);
    } else if (action === UserConstants.setUserNameAction.SKIP) {
      // set user name empty if action is skip
      await pool.query("UPDATE users SET username = '' WHERE ID = $1", [
        userId,
      ]);
    } else {
      return;
    }
  } catch (error) {
    console.error("Error setting user name:", error);
    throw new Error("Error setting user name");
  }
};
