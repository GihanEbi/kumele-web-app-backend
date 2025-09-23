import { Request, Response, NextFunction } from "express";
import { createUserBetaCodeModel } from "../models/userBetaCodeModel";

// create user beta code controller
export const createUserBetaCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email;
    await createUserBetaCodeModel(email);
    res.status(201).json({
      success: true,
      message: "User beta code created successfully",
      data: null,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to follow user.",
    });
    next(err);
  }
};
