import { Request, Response, NextFunction } from "express";
import {
  createOrUpdateUserPermissionsService,
  loginUserService,
  registerUserService,
  setUserNameService,
  updateUserProfilePicture,
} from "../models/userModel";
import { pool } from "../config/db";
import fs from "fs";
import { systemConfig } from "../config/systemConfig";

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

export const uploadUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;

    // 1. Check if user ID is present (from auth middleware)
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication error: User ID not found.",
      });
    }

    // 2. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    const newImagePath = req.file.path;

    // 3. (Optional but Recommended) Delete the old profile picture
    const oldUserData = await pool.query(
      "SELECT profilePicture FROM users WHERE id = $1",
      [userId]
    );
    
    const oldImagePath = oldUserData.rows[0]?.profilepicture;

    if (oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath); // Delete the old file
    }

    // 4. Call the model function to update the database
    const updatedUser = await updateUserProfilePicture(userId, newImagePath);

    const imagePath = updatedUser.profilepicture; // e.g., "uploads\profiles\user.png" on Windows

    // Clean the path for the URL: replace backslashes with forward slashes
    const imageUrlPath = imagePath.replace(/\\/g, "/");

    // 5. Send a successful response
    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      user: {
        id: updatedUser.ID,
        profilePictureUrl: `${systemConfig.baseUrl}/${imageUrlPath}`, // Send back a full URL
      },
    });
  } catch (err: any) {
    // If an error occurs, delete the newly uploaded file to avoid orphans
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Profile picture update failed.",
    });
    next(err);
  }
};
