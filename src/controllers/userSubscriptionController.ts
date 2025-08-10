import { Request, Response, NextFunction } from "express";
import {
  createUserSubscription,
  activateUserSubscription,
  getAllUserSubscriptions,
  getUserSubscription,
} from "../models/userSubscriptionModel";

export const createUserSubscriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;
    const data = req.body;
    data.user_id = userId;
    const subscription = await createUserSubscription(data);
    return res.status(200).json({
      success: true,
      message: "User Subscription created successfully!",
      subscription: subscription,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "User Subscription creation failed",
      error: err,
    });
    next(err);
  }
};

// get all user subscription
export const getAllUserSubscriptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;
    const subscriptions = await getAllUserSubscriptions(userId);
    return res.status(200).json({
      success: true,
      subscriptions: subscriptions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve subscriptions",
      error: err,
    });
    next(err);
  }
};

// activate deactivated subscriptions
export const activateUserSubscriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;
    const subscriptionId = req.params.subscriptionId;
    const subscription = await activateUserSubscription(userId, subscriptionId);
    return res.status(200).json({
      success: true,
      message: "Subscription activated successfully!",
      subscription: subscription,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to activate subscription",
      error: err,
    });
    next(err);
  }
};
