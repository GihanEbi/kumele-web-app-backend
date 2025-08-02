import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import {
  landingPageDetailsSchema,
  landingPageLinksSchema,
} from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { LandingPageDetails, LandingPageLinks } from "../types/types";

export const addOrUpdateLandingPageLinksService = async (
  linksData: LandingPageLinks
): Promise<void> => {
  // Validate the landing page links data against the landing page links schema
  let checkData = validation(landingPageLinksSchema, linksData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  const id = "LPL01";

  try {
    const existingLinks = await pool.query(
      `SELECT * FROM landing_page_links WHERE id = $1`,
      [id]
    );

    if (existingLinks.rows.length > 0) {
      // Update existing links
      const result = await pool.query(
        `
        UPDATE landing_page_links
        SET android_app_link = $1, ios_app_link = $2, youtube_link = $3,
            facebook_link = $4, instagram_link = $5, twitter_link = $6,
            pinterest_link = $7
        WHERE id = $8
        RETURNING *`,
        [
          linksData.android_app_link,
          linksData.ios_app_link,
          linksData.youtube_link,
          linksData.facebook_link,
          linksData.instagram_link,
          linksData.twitter_link,
          linksData.pinterest_link,
          id,
        ]
      );
      return result.rows[0];
    } else {
      // Insert new links
      const result = await pool.query(
        `
        INSERT INTO landing_page_links (id, android_app_link, ios_app_link, youtube_link, facebook_link, instagram_link, twitter_link, pinterest_link)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          id,
          linksData.android_app_link,
          linksData.ios_app_link,
          linksData.youtube_link,
          linksData.facebook_link,
          linksData.instagram_link,
          linksData.twitter_link,
          linksData.pinterest_link,
        ]
      );
      return result.rows[0];
    }
  } catch (error) {
    throw new Error("Failed to add or update landing page links.");
  }
};

export const getLandingPageLinksService =
  async (): Promise<LandingPageLinks> => {
    try {
      const result = await pool.query(
        "SELECT * FROM landing_page_links WHERE id = 'LPL01'"
      );
      if (result.rows.length === 0) {
        throw new Error("Landing page links not found.");
      }

      // remove id and created_at from the result
      result.rows = result.rows.map((row: any) => {
        const { id, created_at, ...rest } = row;
        return rest;
      });
      return result.rows[0];
    } catch (error) {
      throw new Error("Failed to retrieve landing page links.");
    }
  };

export const createLandingPageDetailsService = async (
  details: LandingPageDetails
): Promise<void> => {
  // Validate the landing page details data against the landing page details schema
  let checkData = validation(landingPageDetailsSchema, details);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  const id = await createId(id_codes.idCode.landingPageDetails);

  try {
    const result = await pool.query(
      `
      INSERT INTO landing_page_details (id, title, subtitle, description, bottom_text, background_image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        id,
        details.title,
        details.subtitle,
        details.description,
        details.bottom_text,
        details.background_image_url,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating landing page details:", error);
    throw new Error("Error creating landing page details");
  }
};

export const getAllLandingPageDetailsService = async (): Promise<
  LandingPageDetails[]
> => {
  try {
    const result = await pool.query("SELECT * FROM landing_page_details");
    if (result.rows.length === 0) {
      throw new Error("No landing page details found.");
    }
    return result.rows;
  } catch (error) {
    throw new Error("Failed to retrieve landing page details.");
  }
};

export const getLandingPageDetailsByIdService = async (
  id: string
): Promise<LandingPageDetails> => {
  try {
    const result = await pool.query(
      "SELECT * FROM landing_page_details WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error("Landing page details not found.");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to retrieve landing page details by ID.");
  }
};

export const updateLandingPageDetailsService = async (
  id: string,
  details: LandingPageDetails
): Promise<LandingPageDetails> => {
  // Validate the landing page details data against the landing page details schema
  let checkData = validation(landingPageDetailsSchema, details);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  try {
    const result = await pool.query(
      `
      UPDATE landing_page_details
      SET title = $1,
          subtitle = $2, description = $3, bottom_text = $4, background_image_url = $5
      WHERE id = $6
      RETURNING *`,
      [
        details.title,
        details.subtitle,
        details.description,
        details.bottom_text,
        details.background_image_url,
        id,
      ]
    );
    if (result.rows.length === 0) {
      throw new Error("Landing page details not found for update.");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to update landing page details.");
  }
};
