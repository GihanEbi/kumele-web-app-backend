import { Request, Response, NextFunction } from "express";
import {
  createOrUpdateUserPermissionsService,
  loginUserService,
  registerUserService,
  setUserNameService,
} from "../models/userModel";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "User registration failed",
      error: err,
    });
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await loginUserService({ email, password });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// update user permissions
export const updateUserPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;
    const permissions = req.body;
    await createOrUpdateUserPermissionsService(userId, permissions);
    res.status(200).json({
      success: true,
      message: "User permissions updated successfully",
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "User permissions update failed",
    });
    next(err);
  }
};

// set user name
export const setUserName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;
    const { action, username } = req.body;
    await setUserNameService(userId, action, username);
    res.status(200).json({
      success: true,
      message: "User name updated successfully",
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "User name update failed",
    });
    next(err);
  }
};
