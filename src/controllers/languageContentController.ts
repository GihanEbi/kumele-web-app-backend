import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db";
import { languageContent } from "../constants/languageContentConstant";

export const getProfilePageContents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check user language from database
  const user_id = req.UserID;
  try {
    const userResult = await pool.query(
      `
        SELECT language FROM users WHERE id = $1
      `,
      [user_id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userLanguage = (userResult.rows[0].language ||
      "English") as keyof typeof languageContent.profile;
    // fetch profile page contents from languageContentConstant
    const profileContents =
      languageContent.profile[userLanguage] ||
      languageContent.profile["English"];
    res.status(200).json({
      success: true,
      message: "Profile page contents fetched successfully",
      data: profileContents,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to fetch profile page contents",
    });
    next(err);
  }
};
