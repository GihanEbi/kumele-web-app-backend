import { pool } from "../config/db";

export interface IUserCard {
  user_id: string;
  paypal_token: string;
  card_type: string;
  last4: string;
}

/**
 * Saves a new PayPal payment token (a vaulted card) to the database for a user.
 */
export const saveCardTokenService = async (cardData: IUserCard) => {
  const { user_id, paypal_token, card_type, last4 } = cardData;
  try {
    const result = await pool.query(
      `INSERT INTO user_cards (user_id, paypal_token, card_type, last4)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, card_type, last4, is_default, created_at`, // Note: We don't return the token
      [user_id, paypal_token, card_type, last4]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error saving card token:", error);
    throw new Error("Failed to save card.");
  }
};

/**
 * Fetches all saved cards for a specific user.
 */
export const getUserCardsService = async (userId: string) => {
  try {
    const result = await pool.query(
      `SELECT id, card_type, last4, is_default FROM user_cards WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching user cards:", error);
    throw new Error("Failed to fetch user cards.");
  }
};