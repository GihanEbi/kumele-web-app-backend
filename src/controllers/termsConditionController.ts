import { Request, Response, NextFunction } from "express";
import {
  addOrUpdateTermsAndConditionsService,
  getTermsAndConditionsService,
} from "../models/termsConditionsModel";

export const createOrUpdateTermsCondition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { terms_cond } = req.body;

    // Call the service to create the terms and conditions
    const result = await addOrUpdateTermsAndConditionsService({
      terms_cond,
    });

    return res.status(201).json({
      success: true,
      message: "Terms and Conditions created successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to add user guideline.",
    });
    next(err);
  }
};

// get terms and conditions
export const getTermsAndConditions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getTermsAndConditionsService();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Terms and Conditions not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve terms and conditions.",
    });
    next(err);
  }
};
