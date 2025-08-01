import { Request, Response, NextFunction } from "express";
import { createHobbyService, getHobbiesList } from "../models/hobbyModel";

export const createHobby = async (
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
      return res.status(400).json({ error: "Hobby name is required." });
    }
    if (!file) {
      return res.status(400).json({ error: "SVG icon file is required." });
    }

    // Convert the file buffer to a UTF-8 string (the SVG code)
    const svg_code = file.buffer.toString("utf-8");

    // 4. Call the service function to interact with the database
    const newHobby = await createHobbyService({ name, svg_code });

    // 5. Send a successful response
    return res.status(201).json({
      message: "Hobby created successfully!",
      hobby: newHobby,
    });
  } catch (error: any) {
    console.error("Error in createHobby controller:", error);
    return res
      .status(500)
      .json({ error: error.message || "An internal server error occurred." });
  }
};

// get all hobbies
export const getHobbies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch hobbies from the database (this function should be implemented in the model)
    const hobbies = await getHobbiesList();

    // Send a successful response
    return res.status(200).json({
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
