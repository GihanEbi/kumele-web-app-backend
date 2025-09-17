import { Request, Response, NextFunction } from "express";
import {
  addItemToCart,
  getUserCartByUserId,
  removeItemFromCart,
} from "../models/userCartModel";

// add item to user cart
export const addItemToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cartData = req.body;
    const userID = req.UserID
    
    cartData.user_id = userID; // Ensure the user_id is set from the authenticated user
    const addedItem = await addItemToCart(cartData);
    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: addedItem,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error adding item to cart",
    });
    next(err);
  }
};

// get user cart by user id
export const getUserCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.UserID; // Assuming userId is added to req in auth middleware
    const cartItems = await getUserCartByUserId(userID);
    res.status(200).json({
      success: true,
      message: "User cart fetched successfully",
      data: cartItems,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error fetching user cart",
    });
    next(err);
  }
};

// remove item from user cart
export const removeItemFromCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cartId = req.params.id;
    await removeItemFromCart(cartId);
    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: null,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error removing item from cart",
    });
    next(err);
  }
};
