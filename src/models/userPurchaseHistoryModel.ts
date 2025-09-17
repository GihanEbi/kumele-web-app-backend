import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { createUserPurchaseHistorySchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { UserPurchasesHistory } from "../types/types";

// add purchase to user purchase history
export const addPurchaseToHistory = async (
  purchaseData: UserPurchasesHistory
) => {
  // check all input data with schema validation in Joi
  let checkData = validation(createUserPurchaseHistorySchema, purchaseData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  const { user_id, product_id } = purchaseData;
  //   check user exists
  const userExists = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    user_id,
  ]);
  if (userExists.rowCount === 0) {
    const error = new Error("User does not exist");
    (error as any).statusCode = 404;
    throw error;
  }

    //   check product exists
  const productExists = await pool.query(`SELECT * FROM products WHERE id = $1`, [
    product_id,
  ]);
  if (productExists.rowCount === 0) {
    const error = new Error("Product does not exist");
    (error as any).statusCode = 404;
    throw error;
  }

  try {
    const newId = await createId(id_codes.idCode.userPurchasesHistory);
    const result = await pool.query(
      `INSERT INTO user_purchases_history (id, user_id, product_id) VALUES ($1, $2, $3)`,
      [newId, user_id, product_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding item to purchase history:", error);
    throw new Error("Error adding item to purchase history");
  }
};

// get purchase history by user id
export const getPurchaseHistoryByUserId = async (userId: string) => {
  //   check user exists
  const userExists = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  if (userExists.rowCount === 0) {
    const error = new Error("User does not exist");
    (error as any).statusCode = 404;
    throw error;
  }
  try {
    const result = await pool.query(
      `SELECT * FROM user_purchases_history WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    throw new Error("Error fetching purchase history");
  }
};

// get all purchase history
export const getAllPurchaseHistory = async () => {
  try {
    const result = await pool.query(`SELECT * FROM user_purchases_history`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching all purchase history:", error);
    throw new Error("Error fetching all purchase history");
  }
};
