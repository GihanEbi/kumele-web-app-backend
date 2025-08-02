import { Request, Response, NextFunction } from "express";
import {
  addOrUpdateLandingPageLinksService,
  createLandingPageDetailsService,
  getAllLandingPageDetailsService,
  getLandingPageDetailsByIdService,
  getLandingPageLinksService,
  updateLandingPageDetailsService,
} from "../models/landingPageModel";
import fs from "fs";

export const creteLandingPageLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      android_app_link,
      ios_app_link,
      youtube_link,
      facebook_link,
      instagram_link,
      twitter_link,
      pinterest_link,
    } = req.body;

    // Validate the incoming data
    if (
      !android_app_link ||
      !ios_app_link ||
      !youtube_link ||
      !facebook_link ||
      !instagram_link ||
      !twitter_link ||
      !pinterest_link
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Call the service to add or update landing page links
    let result = await addOrUpdateLandingPageLinksService({
      android_app_link,
      ios_app_link,
      youtube_link,
      facebook_link,
      instagram_link,
      twitter_link,
      pinterest_link,
    });

    res.status(200).json({
      success: true,
      message: "Landing page links added successfully.",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to add landing page links.",
    });
    next(err);
  }
};

export const getLandingPageLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const links = await getLandingPageLinksService();
    res.status(200).json({
      success: true,
      data: links,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve landing page links.",
    });
    next(err);
  }
};

export const createLandingPageDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, subtitle, description, bottom_text } = req.body;

    // 2. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No background image file provided.",
      });
    }
    const background_image_url = req.file.path;

    // Call the service to create landing page details
    let result = await createLandingPageDetailsService({
      title,
      subtitle,
      description,
      bottom_text,
      background_image_url,
    });

    res.status(200).json({
      success: true,
      message: "Landing page details created successfully.",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to create landing page details.",
    });
    next(err);
  }
};

export const getLandingPageDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const details = await getAllLandingPageDetailsService();
    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve landing page details.",
    });
    next(err);
  }
};

export const getLandingPageDetailsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }
    const details = await getLandingPageDetailsByIdService(id);
    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve landing page details by ID.",
    });
    next(err);
  }
};

export const updateLandingPageDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, bottom_text } = req.body;

    // Validate the incoming data
    if (!id || !title || !subtitle || !description || !bottom_text) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No background image file provided.",
      });
    }
    const background_image_url = req.file.path;

    
    // 3. (Optional but Recommended) Delete the old profile picture
    const oldDetails = await getLandingPageDetailsByIdService(id);
    if (oldDetails && oldDetails.background_image_url && fs.existsSync(oldDetails.background_image_url)) {
      fs.unlinkSync(oldDetails.background_image_url);
    }

    // Call the service to update landing page details
    let result = await updateLandingPageDetailsService(id, {
      title,
      subtitle,
      description,
      bottom_text,
      background_image_url,
    });

    res.status(200).json({
      success: true,
      message: "Landing page details updated successfully.",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to update landing page details.",
    });
    next(err);
  }
};
