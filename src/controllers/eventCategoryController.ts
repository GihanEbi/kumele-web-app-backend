import { Request, Response, NextFunction } from "express";
import {
  createEventCategoryService,
  getEventCategoriesList,
} from "../models/eventCategoryModel";

export const createEventCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Extract data from the request
    const { name } = req.body;
    const file = req.file;

    // 2. Validate the input
    if (!name) {
      return res
        .status(400)
        .json({ error: "Event category name is required." });
    }
    if (!file) {
      return res.status(400).json({ error: "SVG icon file is required." });
    }

    // Convert the file buffer to a UTF-8 string (the SVG code)
    const svg_code = file.buffer.toString("utf-8");

    // 4. Call the service function to interact with the database
    const newEventCategory = await createEventCategoryService({
      name,
      svg_code,
    });

    // 5. Send a successful response
    return res.status(201).json({
      message: "Event category created successfully!",
      eventCategory: newEventCategory,
    });
  } catch (error: any) {
    console.error("Error in createEventCategory controller:", error);
    return res
      .status(500)
      .json({ error: error.message || "An internal server error occurred." });
  }
};

// get all event categories
export const getEventCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch event categories from the database (this function should be implemented in the model)
    const eventCategories = await getEventCategoriesList();

    // Send a successful response
    return res.status(200).json({
      success: true,
      message: "Event categories fetched successfully",
      data: eventCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch event categories",
      error: error,
    });
    next(error);
  }
};
