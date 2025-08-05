import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { UserConstants } from "../constants/userConstants";
import {
  changePasswordSchema,
  loginSchema,
  permissionSchema,
  updateUserNameSchema,
  userRegistrationSchema,
  twoFactorAuthSetupSchema,
  twoFactorAuthVerifySchema,
  deleteAccountSchema,
  userEventCategoriesSchema,
} from "../lib/schemas/schemas";
import { generateToken } from "../service/authService/authService";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import {
  ChangePassword,
  DeleteAccount,
  SetTwoFactorAuthentication,
  User,
  UserEventCategory,
  UserNotificationSettings,
  VerifyTwoFactorAuthentication,
} from "../types/types";
import { comparePassword, hashPassword } from "../utils/hashUtils";
import speakeasy from "speakeasy";
import qrCode from "qrcode";

export const registerUserService = async (userData: User): Promise<User> => {
  // check all user data with schema validation in Joi
  let checkData = validation(userRegistrationSchema, userData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
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

  function generateRandomCode(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  try {
    // generate the id for the user
    const userId = await createId(id_codes.idCode.user);
    userData.ID = userId;

    // generate the referral code for the user
    userData.my_referral_code = generateRandomCode(7);

    // hash the user password
    userData.password = await hashPassword(userData.password);

    const result = await pool.query(
      "INSERT INTO users (ID, fullName, email, password, gender, language, dateOfBirth,referralCode,aboveLegalAge,termsAndConditionsAccepted, subscribedToNewsletter,my_referral_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
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
        userData.my_referral_code,
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

  // remove user password field in result
  existingUser.rows[0].password = undefined;
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

// This function updates the user's profile picture path in the DB
export const updateUserProfilePicture = async (
  ID: string,
  profilePicture: string
): Promise<User> => {
  try {
    const result = await pool.query(
      `UPDATE users 
       SET profilePicture = $1 
       WHERE id = $2 
       RETURNING *`, // RETURNING * gives you back the updated user row
      [profilePicture, ID]
    );

    if (result.rows.length === 0) {
      // This case is unlikely if the auth middleware works, but good for safety
      throw new Error("User not found.");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error in updateUserProfilePicture model:", error);
    throw error; // Re-throw the error to be caught by the controller
  }
};

// This function updates the user's profile about section in the DB
export const updateUserAboutService = async (
  userId: string,
  about: string
): Promise<void> => {
  try {
    await pool.query("UPDATE users SET about_me = $1 WHERE ID = $2", [
      about,
      userId,
    ]);
  } catch (error) {
    console.error("Error in updateUserAboutService model:", error);
    throw error;
  }
};

//  This function create or updates the user's notifications section in the DB
export const createOrUpdateUserNotificationsService = async (
  userId: string,
  soundNotifications: boolean,
  emailNotifications: boolean
): Promise<void> => {
  try {
    // Check if the user exists
    const existingUser = await pool.query("SELECT * FROM users WHERE ID = $1", [
      userId,
    ]);

    if (existingUser.rows.length === 0) {
      const error = new Error(`User not found: ${userId}`);
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if the notification settings already exist
    const existingNotificationSettings = await pool.query(
      "SELECT * FROM user_notifications WHERE userID = $1",
      [userId]
    );

    if (existingNotificationSettings.rows.length > 0) {
      // Update existing notification settings
      await pool.query(
        "UPDATE user_notifications SET sound_notifications = $1, email_notifications = $2 WHERE userID = $3",
        [soundNotifications, emailNotifications, userId]
      );
    } else {
      // Insert new notification settings
      await pool.query(
        "INSERT INTO user_notifications (userID, sound_notifications, email_notifications) VALUES ($1, $2, $3)",
        [userId, soundNotifications, emailNotifications]
      );
    }
  } catch (error) {
    console.error("Error creating or updating user notifications:", error);
    throw new Error("Error creating or updating user notifications");
  }
};

// get all the data of the user from DB
export const getUserDataService = async (userId: string): Promise<User> => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE ID = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      const error = new Error(`User not found: ${userId}`);
      (error as any).statusCode = 404;
      throw error;
    }

    // remove user password field in result
    result.rows[0].password = undefined;
    // return the user data
    return result.rows[0];
  } catch (error) {
    console.error("Error in getUserDataService model:", error);
    throw error; // Re-throw the error to be caught by the controller
  }
};

// get user notification status
export const getUserNotificationStatusService = async (
  userId: string
): Promise<UserNotificationSettings> => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_notifications WHERE userID = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      const error = new Error(`User notification status not found: ${userId}`);
      (error as any).statusCode = 404;
      throw error;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error in getUserNotificationStatusService model:", error);
    throw error; // Re-throw the error to be caught by the controller
  }
};

// change password service
export const changePasswordService = async (
  passwordData: ChangePassword
): Promise<void> => {
  // check all passwordData with schema validation in Joi
  let checkData = validation(changePasswordSchema, passwordData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  try {
    const { userId, oldPassword, newPassword } = passwordData;

    // Check if the user exists
    const existingUser = await pool.query("SELECT * FROM users WHERE ID = $1", [
      userId,
    ]);

    if (existingUser.rows.length === 0) {
      const error = new Error(`User not found: ${userId}`);
      (error as any).statusCode = 404;
      throw error;
    }

    // Verify the old password
    const isOldPasswordValid = await comparePassword(
      oldPassword,
      existingUser.rows[0].password
    );

    if (!isOldPasswordValid) {
      const error = new Error("Old password is incorrect.");
      (error as any).statusCode = 401;
      throw error;
    }

    // Hash the new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update the user's password in the database
    await pool.query("UPDATE users SET password = $1 WHERE ID = $2", [
      hashedNewPassword,
      userId,
    ]);
  } catch (error) {
    console.error("Error in changePasswordService model:", error);
    throw error;
  }
};

// setup two factor authentication service
export const setTwoFactorAuthenticationService = async (
  twoFactData: SetTwoFactorAuthentication
): Promise<string> => {
  // check all twoFactData with schema validation in Joi
  let checkData = validation(twoFactorAuthSetupSchema, twoFactData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  const { userId, isEnabled } = twoFactData;

  // if isEnabled is false, disable 2FA
  if (!isEnabled) {
    await pool.query(
      "UPDATE users SET is_2fa_enabled = $1, to_tp_secret = $2 WHERE ID = $3",
      [isEnabled, null, userId]
    );
    return "Two-factor authentication disabled successfully.";
  }
  // if isEnabled is true, enable 2FA
  // Generate a new secret for the user
  const secret = speakeasy.generateSecret({
    name: `NextAuth2FA (${userId})`,
  });

  const url = await qrCode.toDataURL(secret.otpauth_url!);
  try {
    await pool.query(
      "UPDATE users SET is_2fa_enabled = $1, to_tp_secret = $2 WHERE ID = $3",
      [isEnabled, secret.base32, userId]
    );
    return url;
  } catch (error) {
    console.error("Error in setupTwoFactorAuthService model:", error);
    throw error;
  }
};

// verify two factor authentication service
export const verifyTwoFactorAuthenticationService = async (
  verificationData: VerifyTwoFactorAuthentication
): Promise<void> => {
  // check all verificationData with schema validation in Joi
  let checkData = validation(twoFactorAuthVerifySchema, verificationData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  try {
    const { userId, otp } = verificationData;

    // Check if the user exists
    const existingUser = await pool.query("SELECT * FROM users WHERE ID = $1", [
      userId,
    ]);

    if (existingUser.rows.length === 0) {
      const error = new Error(`User not found: ${userId}`);
      (error as any).statusCode = 404;
      throw error;
    }

    // Verify the OTP
    const isOtpValid = speakeasy.totp.verify({
      secret: existingUser.rows[0].to_tp_secret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!isOtpValid) {
      const error = new Error("Invalid OTP.");
      (error as any).statusCode = 401;
      throw error;
    }

    return; // OTP is valid, no further action needed
  } catch (error) {
    console.error(
      "Error in verifyTwoFactorAuthenticationService model:",
      error
    );
    throw error;
  }
};

// delete user account service
export const deleteUserAccountService = async (
  deleteData: DeleteAccount
): Promise<void> => {
  const { userId, password } = deleteData;
  // check all deleteData with schema validation in Joi
  let checkData = validation(deleteAccountSchema, deleteData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  // Check if the user exists
  const existingUser = await pool.query("SELECT * FROM users WHERE ID = $1", [
    userId,
  ]);

  if (existingUser.rows.length === 0) {
    const error = new Error(`User not found: ${userId}`);
    (error as any).statusCode = 404;
    throw error;
  }

  // Verify the password
  const isPasswordValid = await comparePassword(
    password,
    existingUser.rows[0].password
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid password.");
    (error as any).statusCode = 401;
    throw error;
  }

  try {
    // Delete the user account other tables that act user id as foreign key
    await pool.query("DELETE FROM user_notifications WHERE userID = $1", [
      userId,
    ]);
    await pool.query("DELETE FROM permissions WHERE user_id = $1", [userId]);
    // delete email_otp table that equals to this user email
    await pool.query("DELETE FROM email_otp WHERE email = $1", [
      existingUser.rows[0].email,
    ]);
    // Finally delete the user from the users table
    await pool.query("DELETE FROM users WHERE ID = $1", [userId]);
  } catch (error) {
    console.error("Error in deleteUserAccountService model:", error);
    throw error;
  }
};

//  function for set user event categories
export const setUserEventCategoriesService = async (
  data: UserEventCategory
): Promise<void> => {
  // check all data with schema validation in Joi
  let checkData = validation(userEventCategoriesSchema, data);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  const { userId, event_category_ids } = data;

  try {
    // Check if the user exists
    const existingUser = await pool.query("SELECT * FROM users WHERE ID = $1", [
      userId,
    ]);
    if (existingUser.rows.length === 0) {
      const error = new Error(`User not found: ${userId}`);
      (error as any).statusCode = 404;
      throw error;
    }
    // Check if the event categories exist
    const existingEventCategories = await pool.query(
      "SELECT * FROM event_categories WHERE ID = ANY($1)",
      [event_category_ids]
    );
    if (existingEventCategories.rows.length === 0) {
      const error = new Error(
        `Event Categories not found: ${event_category_ids.join(", ")}`
      );
      (error as any).statusCode = 404;
      throw error;
    }

    // Delete existing event categories for the user
    await pool.query("DELETE FROM user_event_categories WHERE user_id = $1", [
      userId,
    ]);

    // Insert new event categories for the user
    const insertPromises = event_category_ids.map((eventCategory) =>
      pool.query(
        "INSERT INTO user_event_categories (user_id, event_category_id) VALUES ($1, $2)",
        [userId, eventCategory]
      )
    );
    await Promise.all(insertPromises);
  } catch (error) {
    console.error("Error in setUserEventCategoriesService model:", error);
    throw error;
  }
};

// get user event categories service
export const getUserEventCategoriesService = async (
  userId: string
): Promise<string[]> => {
  try {
    const result = await pool.query(
      "SELECT ec.id FROM event_categories ec JOIN user_event_categories uec ON ec.ID = uec.event_category_id WHERE uec.user_id = $1",
      [userId]
    );
    console.log(result);

    return result.rows.map((row) => row.id);
  } catch (error) {
    console.error("Error in getUserEventCategoriesService model:", error);
    throw error;
  }
};
