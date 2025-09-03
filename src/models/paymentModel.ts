import { pool } from "../config/db";

interface CardDetails {
  paypal_token_id: string;
  card_brand: string;
  last4: string;
}

export const saveCardToDbService = async (
  userId: string,
  cardDetails: CardDetails
) => {
  const { paypal_token_id, card_brand, last4 } = cardDetails;
  try {
    const result = await pool.query(
      `INSERT INTO saved_paypal_cards (user_id, paypal_token_id, card_brand, last4)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, paypal_token_id, card_brand, last4]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error saving card to DB:", error);
    // Handle potential unique constraint violation if token already exists
    if (typeof error === "object" && error !== null && "code" in error && (error as any).code === '23505') {
        throw new Error("This payment method is already saved.");
    }
    throw new Error("Error saving card to the database");
  }
};

export const listUserCardsFromDbService = async (userId: string) => {
  try {
    const result = await pool.query(
      `SELECT id, paypal_token_id, card_brand, last4, created_at
       FROM saved_paypal_cards
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching user cards from DB:", error);
    throw new Error("Error fetching user cards");
  }
};