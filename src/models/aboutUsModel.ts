import { pool } from "../config/db";

export const addOrUpdateAboutUsService = async (data: {
  about_us: string;
}) => {
  const { about_us } = data;
  const id = "AU01";
  try {
    //   check if the guideline already exists
    const existingAboutUs = await pool.query(
      `
      SELECT * FROM about_us WHERE id = $1
    `,
      [id]
    );

    if (existingAboutUs.rows.length > 0) {
      // Update the existing record
      const result = await pool.query(
        `
        UPDATE about_us SET about_us = $1 WHERE id = $2 RETURNING *
      `,
        [about_us, id]
      );
      return result.rows[0];
    } else {
      // Insert a new record
      const result = await pool.query(
        `
        INSERT INTO about_us (id, about_us) VALUES ($1, $2) RETURNING *
      `,
        [id, about_us]
      );
      return result.rows[0];
    }
  } catch (error) {
    console.error("Error adding About Us content:", error);
    throw new Error("Error adding About Us content");
  }
};


export const getAboutUsService = async (): Promise<{ about_us: string }> => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM about_us WHERE id = $1
    `,
      ["AU01"]
    );

    if (result.rows.length > 0) {// remove id and created_at from the result
    result.rows = result.rows.map((row: any) => {
      const { id, created_at, ...rest } = row;
      return rest;
    });
    return result.rows[0];
    } else {
      throw new Error("About Us content not found");
    }
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    throw new Error("Error fetching About Us content");
  }
};