import { Request, Response, NextFunction } from "express";
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscriptionById,
} from "../models/subscriptionDataModel";

export const createSubscriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subscriptionData = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "SVG icon file is required." });
    }
    subscriptionData.icon_code = file.buffer.toString("utf-8");

    const newSubscription = await createSubscription(subscriptionData);
    return res.status(201).json({
      message: "Subscription created successfully!",
      subscription: newSubscription,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Subscription creation failed",
    });
    next(err);
  }
};

export const getAllSubscriptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subscriptions = await getAllSubscriptions();
    return res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Get all subscriptions failed",
    });
    next(err);
  }
};

export const getSubscriptionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const subscription = await getSubscriptionById(id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Get subscription by ID failed",
    });
    next(err);
  }
};

export const updateSubscriptionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const subscriptionData = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "SVG icon file is required." });
    }
    subscriptionData.icon_code = file.buffer.toString("utf-8");
    const updatedSubscription = await updateSubscriptionById(
      id,
      subscriptionData
    );
    if (!updatedSubscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedSubscription,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Update subscription failed",
    });
    next(err);
  }
};
