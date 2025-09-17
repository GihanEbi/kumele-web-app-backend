import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { createUserCartSchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { UserCart } from "../types/types";

// add item to user cart
export const addItemToCart = async (cartData: UserCart) => {
  // check all input data with schema validation in Joi
  let checkData = validation(createUserCartSchema, cartData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  const { user_id, product_id, quantity } = cartData;
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
  const productExists = await pool.query(
    `SELECT * FROM products WHERE id = $1`,
    [product_id]
  );
  if (productExists.rowCount === 0) {
    const error = new Error("Product does not exist");
    (error as any).statusCode = 404;
    throw error;
  }
  try {
    const cartId = await createId(id_codes.idCode.userCart);
    const result = await pool.query(
      `INSERT INTO user_cart (id, user_id, product_id, quantity)
            VALUES ($1, $2, $3, $4)
        `,
      [cartId, user_id, product_id, quantity]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw new Error("Error adding item to cart");
  }
};

// get user cart by user id
export const getUserCartByUserId = async (userId: string) => {
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
    // get data and join with products table to get product details
    const result = await pool.query(
      `SELECT uc.id, uc.user_id, uc.product_id, uc.quantity, p.name, p.description, p.type, p.price
        FROM user_cart uc
        JOIN products p ON uc.product_id = p.id
        WHERE uc.user_id = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching user cart:", error);
    throw new Error("Error fetching user cart");
  }
};

// remove item from user cart
export const removeItemFromCart = async (cartId: string) => {
  try {
    const result = await pool.query(`DELETE FROM user_cart WHERE id = $1`, [
      cartId,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw new Error("Error removing item from cart");
  }
};
