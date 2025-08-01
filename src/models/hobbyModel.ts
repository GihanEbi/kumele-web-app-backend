// src/models/hobbyModel.ts
import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { createHobbySchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { CreateHobby } from "../types/types";

export const createHobbyService = async (
  hobbyData: CreateHobby
): Promise<CreateHobby> => {
  // check all user data with schema validation in Joi
  let checkData = validation(createHobbySchema, hobbyData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  try {
    // generate the id for the hobby
    const hobbyId = await createId(id_codes.idCode.hobby);
    const query = `
            INSERT INTO hobbies (id, name, svg_code)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    const result = await pool.query(query, [
      hobbyId,
      hobbyData.name,
      hobbyData.svg_code,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error in createHobbyService:", error);
    throw new Error("Failed to create hobby in the database.");
  }
};

export const getHobbiesList = async (): Promise<CreateHobby[]> => {
  try {
    const result = await pool.query(`
            SELECT * FROM hobbies 
        `);

        // remove created_at field from the result
    result.rows.forEach((row) => {
      delete row.created_at;
    });
    return result.rows;
  } catch (error) {
    console.error("Error in getHobbiesList:", error);
    throw new Error("Failed to fetch hobbies from the database.");
  }
};
