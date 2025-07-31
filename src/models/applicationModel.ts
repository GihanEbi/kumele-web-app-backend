import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { createHobbySchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { Hobby } from "../types/types";

export const createHobbyService = async (hobbyData: Hobby): Promise<Hobby> => {
  // check all user data with schema validation in Joi
  let checkData = validation(createHobbySchema, hobbyData);
  if (checkData !== null) {
    return Promise.reject(`Invalid hobby data: ${JSON.stringify(checkData)}`);
  }

  try {
    // generate the id for the hobby
    const hobbyId = await createId(id_codes.idCode.hobby);
    hobbyData.id = hobbyId;

    const result = await pool.query(
      "INSERT INTO hobbies (id, name, icon, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [hobbyData.id, hobbyData.name, hobbyData.icon]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating hobby:", error);
    throw new Error("Error creating hobby");
  }
};
