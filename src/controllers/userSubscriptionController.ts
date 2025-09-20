import { Request, Response, NextFunction } from "express";
import {
  createUserSubscription,
  activateUserSubscription,
  getAllUserSubscriptions,
  getUserSubscription,
  deactivateUserSubscription,
  getAllUserSubscriptionsAndUnsubscribes,
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
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to create user subscription.",
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
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve user subscriptions.",
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
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to activate subscription.",
    });
    next(err);
  }
};

// deactivate subscriptions controller
export const deactivateUserSubscriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;
    const subscriptionId = req.params.subscriptionId;
    const subscription = await deactivateUserSubscription(
      userId,
      subscriptionId
    );
    return res.status(200).json({
      success: true,
      message: "Subscription deactivated successfully!",
      subscription: subscription,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to deactivate subscription.",
    });
    next(err);
  }
};
//  getAllUserSubscriptionsAndUnsubscribes
export const getAllUserSubscriptionsAndUnsubscribesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;
    const subscriptions = await getAllUserSubscriptionsAndUnsubscribes(userId);
    return res.status(200).json({
      success: true,
      subscriptions: subscriptions,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve user subscriptions.",
    });
    next(err);
  }
};
