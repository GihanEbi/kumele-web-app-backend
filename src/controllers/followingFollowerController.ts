import { Request, Response, NextFunction } from "express";

import {
  followUserService,
  getFollowersFollowingCountService,
  getFollowersService,
  getFollowingService,
  unfollowUserService,
} from "../models/followingFollowerModel";

// controller to follow a user
export const followUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const follower_id = req.UserID;

  const { following_id } = req.body;
  try {
    const result = await followUserService(following_id, follower_id);
    res.status(201).json({
      success: true,
      message: "User followed successfully",
      data: result,
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

// controller to unfollow a user
export const unfollowUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const follower_id = req.UserID;
  const { following_id } = req.body;
  try {
    const result = await unfollowUserService(following_id, follower_id);
    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to unfollow user.",
    });
    next(err);
  }
};

// controller to get followers of a user
export const getFollowersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.UserID;
  try {
    const result = await getFollowersService(user_id);
    res.status(200).json({
      success: true,
      message: "Followers fetched successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch followers.",
    });
    next(err);
  }
};

// controller to get following of a user
export const getFollowingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.UserID;
  try {
    const result = await getFollowingService(user_id);
    res.status(200).json({
      success: true,
      message: "Following fetched successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch following.",
    });
    next(err);
  }
};

// function to get count of followers and following for a user
export const getFollowersFollowingCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.UserID;
  try {
    const result = await getFollowersFollowingCountService(user_id);
    res.status(200).json({
      success: true,
      message: "Followers and following count fetched successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch followers and following count.",
    });
    next(err);
  }
};
