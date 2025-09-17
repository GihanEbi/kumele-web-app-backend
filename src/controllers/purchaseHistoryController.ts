import { Request, Response, NextFunction } from "express";
import {
  addPurchaseToHistory,
  getAllPurchaseHistory,
  getPurchaseHistoryByUserId,
} from "../models/userPurchaseHistoryModel";

// add purchase to history
export const addPurchaseToHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseData = req.body;
    const userId = req.UserID;
    purchaseData.user_id = userId;
    const result = await addPurchaseToHistory(purchaseData);
    res.status(201).json({
      success: true,
      message: "Purchase added to history successfully",
      data: result,
    });
  } catch (error) {
    const err = error as any;
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error adding purchase to history",
    });
    next(err);
  }
};

// get purchase history by user id
export const getPurchaseHistoryByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;
    const result = await getPurchaseHistoryByUserId(userId);
    res.status(200).json({
      success: true,
      message: "Purchase history fetched successfully",
      data: result,
    });
  } catch (error) {
    const err = error as any;
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error fetching purchase history",
    });
    next(err);
  }
};

// get all purchase history
export const getAllPurchaseHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllPurchaseHistory();
    res.status(200).json({
      success: true,
      message: "All purchase history fetched successfully",
      data: result,
    });
  } catch (error) {
    const err = error as any;
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error fetching all purchase history",
    });
    next(err);
  }
};
