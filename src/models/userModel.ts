import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { UserConstants } from "../constants/userConstants";
import { userRegistrationSchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { User } from "../types/types";
import { hashPassword } from "../utils/hashUtils";

export const getAllUsersService = async (): Promise<User[]> => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

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
