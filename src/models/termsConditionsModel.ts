import { pool } from "../config/db";
import { termsAndConditionsSchema } from "../lib/schemas/schemas";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { TermsAndConditions } from "../types/types";

export const addOrUpdateTermsAndConditionsService = async (
  termsData: TermsAndConditions
): Promise<void> => {
  // Validate the terms data against the terms and conditions schema
  let checkData = validation(termsAndConditionsSchema, termsData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  const id = "TC01"; // Assuming a static ID for simplicity

  try {
    // Check if the terms and conditions already exist
    const existingTerms = await pool.query(
      `
      SELECT * FROM terms_conditions WHERE id = $1
    `,
      [id]
    );

    if (existingTerms.rows.length > 0) {
      // If it exists, update the existing terms and conditions
      const result = await pool.query(
        `
            UPDATE terms_conditions
            SET terms_cond = $1
            WHERE id = $2
            RETURNING *
        `,
        [termsData.terms_cond, id]
      );
      return result.rows[0];
    }

    // Insert the terms and conditions into the database with the id
    const result = await pool.query(
      `
      INSERT INTO terms_conditions (id, terms_cond)
      VALUES ($1, $2)
      RETURNING *
    `,
      [id, termsData.terms_cond]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error adding or updating terms and conditions:", error);
    throw new Error("Error adding or updating terms and conditions");
  }
};

export const getTermsAndConditionsService =
  async (): Promise<TermsAndConditions | null> => {
    try {
      const result = await pool.query(
        `
      SELECT * FROM terms_conditions
    `
      );

      // remove id and created_at from the result
      if (result.rows.length === 0) {
        return null;
      }
      const { id, created_at, ...rest } = result.rows[0];
      return rest as TermsAndConditions;
    } catch (error) {
      console.error("Error retrieving terms and conditions:", error);
      throw new Error("Error retrieving terms and conditions");
    }
  };
