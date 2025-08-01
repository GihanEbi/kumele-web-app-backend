import { Request, Response, NextFunction } from "express";
import { addOrUpdateUserGuidelineService, getUserGuidelinesService } from "../models/guidlinesModel";

export const createGuidelines = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { guideline, how_to, popular } = req.body;

  try {
    let result = await addOrUpdateUserGuidelineService({
      guideline,
      how_to,
      popular,
    });

    res.status(200).json({
      success: true,
      message: "User guideline added successfully.",
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

// get guidelines
export const getGuidelines = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const guidelines = await getUserGuidelinesService();
    res.status(200).json({
      success: true,
      data: guidelines,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve user guidelines.",
    });
    next(err);
  }
};
