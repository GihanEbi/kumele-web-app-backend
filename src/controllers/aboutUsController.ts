import { Request, Response, NextFunction } from "express";
import {
  addOrUpdateAboutUsService,
  getAboutUsService,
} from "../models/aboutUsModel";

export const createAboutUs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { about_us } = req.body;

    // Validate the incoming data
    if (!about_us) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Call the service to add or update About Us content
    let result = await addOrUpdateAboutUsService({ about_us });
    res.status(200).json({
      success: true,
      message: "About Us content added successfully.",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to add About Us content.",
    });
    next(err);
  }
};

export const getAboutUs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const aboutUsContent = await getAboutUsService();
    res.status(200).json({
      success: true,
      data: aboutUsContent,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve About Us content.",
    });
    next(err);
  }
};
