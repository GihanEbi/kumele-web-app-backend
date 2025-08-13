import { Request, Response, NextFunction } from "express";
import {
  createAdvertService,
  getAdvertByIdService,
  getAdvertsByCategoryIdService,
  getAdvertsByUserIdService,
  getAllAdvertsService,
  updateAdvertByIdService,
} from "../models/advertModel";
import fs from "fs";

// this function is for create the advert image and return its path
export const createAdvertImage = async (
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

    res.status(201).json({
      message: "advert image created successfully.",
      advert_img_url: normalizedPath,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error creating advert image",
    });
    next(err);
  }
};

export const createAdvert = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const advertData = req.body;

  try {
    const newAdvert = await createAdvertService(advertData);
    res
      .status(201)
      .json({ message: "Advert created successfully.", advert: newAdvert });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// get all advert
export const getAllAdverts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adverts = await getAllAdvertsService();

    res.status(200).json({
      success: true,
      data: adverts,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving adverts",
    });
    next(err);
  }
};
// this function retrieves adverts by user ID
export const getAdvertsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const adverts = await getAdvertsByUserIdService(userId);
    res.status(200).json({
      success: true,
      data: adverts,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving adverts",
    });
    next(err);
  }
};
// this function retrieves adverts by category ID
export const getAdvertsByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.categoryId;
    const adverts = await getAdvertsByCategoryIdService(categoryId);
    res.status(200).json({
      success: true,
      data: adverts,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving adverts",
    });
    next(err);
  }
};
// this function retrieves an advert by its ID
export const getAdvertById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const advertId = req.params.advertId;
    const advert = await getAdvertByIdService(advertId);
    res.status(200).json({
      success: true,
      data: advert,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert",
    });
    next(err);
  }
};

// this function updates an advert by its ID
export const updateAdvertById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const advertId = req.params.advertId;
    const updatedData = req.body;
    const updatedAdvert = await updateAdvertByIdService(advertId, updatedData);
    res.status(200).json({
      success: true,
      data: updatedAdvert,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error updating advert",
    });
    next(err);
  }
};
