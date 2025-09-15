import { Request, Response, NextFunction } from "express";
import {
  createUserSubscription,
  activateUserSubscription,
  getAllUserSubscriptions,
  getUserSubscription,
  deactivateUserSubscription,
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
    console.log(err);
    
    res.status(500).json({
      success: false,
      message: "User Subscription creation failed",
      error: err.message || err,
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
  } catch (err : any) {
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
    console.log(err);
    
    res.status(500).json({
      success: false,
      message: "Failed to activate subscription",
      error: err,
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
    const subscription = await deactivateUserSubscription(userId, subscriptionId);
    return res.status(200).json({
      success: true,
      message: "Subscription deactivated successfully!",
      subscription: subscription,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate subscription",
      error: err,
    });
    next(err);
  }
};