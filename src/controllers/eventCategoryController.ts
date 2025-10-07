import { Request, Response, NextFunction } from "express";
import {
  createEventCategoryService,
  getEventCategoriesList,
  updateEventCategoryById,
} from "../models/eventCategoryModel";

const baseUrl = process.env.BASE_URL;

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
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to create event category.",
    });
    next(err);
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
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch event categories.",
    });
    next(err);
  }
};

// create event category icon img
export const createIconImg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }
    const normalizedPath = req.file.path.replace(/\\/g, "/");
    // add baseurl to the path
    const fullPath = `${baseUrl}/${normalizedPath}`;

    res.status(201).json({
      success: true,
      message: "Icon image created successfully.",
      icon_img_url: fullPath,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Icon image creation failed",
    });
    next(err);
  }
};

// update event category by id
export const updateEventCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.categoryId;
    const { name, svg_code, icon_dark_img_url, icon_light_img_url } = req.body;
    if (!categoryId) {
      return res.status(400).json({ error: "Event category ID is required." });
    }
    const updatedEventCategory = await updateEventCategoryById(categoryId, {
      name,
      svg_code,
      icon_dark_img_url,
      icon_light_img_url,
    });
    if (!updatedEventCategory) {
      return res
        .status(404)
        .json({ error: "Event category not found with the provided ID." });
    }
    return res.status(200).json({
      message: "Event category updated successfully!",
      eventCategory: updatedEventCategory,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Event category update failed",
    });
    next(err);
  }
};
