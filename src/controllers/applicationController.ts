import { Request, Response, NextFunction } from "express";
import { hobbiesConstants } from "../constants/hobbiesConstants";
import { createHobbyService } from "../models/applicationModel";

// create hobby
export const createHobby = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hobbyData = await createHobbyService(req.body);
    res.status(201).json({
      success: true,
      message: "Hobby created successfully",
      data: hobbyData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create hobby",
      error: error,
    });
    next(error);
  }
};

// get hobbies list
export const getHobbiesList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hobbies = hobbiesConstants.hobbies;
    res.status(200).json({
      success: true,
      message: "Hobbies fetched successfully",
      data: hobbies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hobbies",
      error: error,
    });
    next(error);
  }
};
