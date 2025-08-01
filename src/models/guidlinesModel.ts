import { pool } from "../config/db";
import { guidelinesSchema } from "../lib/schemas/schemas";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { UserGuideline } from "../types/types";

export const addOrUpdateUserGuidelineService = async (
  guidelineData: UserGuideline
): Promise<void> => {
  // Validate the guideline data against the guidelines schema
  let checkData = validation(guidelinesSchema, guidelineData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  const id = "GI01";

  try {
    //   check if the guideline already exists
    const existingGuideline = await pool.query(
      `
      SELECT * FROM user_guidelines WHERE id = $1
    `,
      [id]
    );
    if (existingGuideline.rows.length > 0) {
      // If it exists, update the existing guideline
      const result = await pool.query(
        `
            UPDATE user_guidelines
            SET guideline = $1, how_to = $2, popular = $3
            WHERE id = $4
            RETURNING *
        `,
        [
          guidelineData.guideline,
          guidelineData.how_to,
          guidelineData.popular,
          id,
        ]
      );
      return result.rows[0];
    }

    // Insert the guideline into the database with the id
    const result = await pool.query(
      `
      INSERT INTO user_guidelines (id, guideline, how_to, popular)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [id, guidelineData.guideline, guidelineData.how_to, guidelineData.popular]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error adding user guideline:", error);
    throw new Error("Error adding user guideline");
  }
};

export const getUserGuidelinesService = async (): Promise<UserGuideline[]> => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM user_guidelines
    `
    );

    // remove id and created_at from the result
    result.rows = result.rows.map((row: any) => {
      const { id, created_at, ...rest } = row;
      return rest;
    });
    return result.rows;
  } catch (error) {
    console.error("Error retrieving user guidelines:", error);
    throw new Error("Error retrieving user guidelines");
  }
};
