import { Request, Response, NextFunction } from "express";
import { createUpdateEmailOtp, verifyEmailOtp } from "../models/otpModel";

export const sendOtpForEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const otpData = req.body;
    const otp = await createUpdateEmailOtp(otpData);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      //   data: otp,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to send OTP.",
    });
    next(err);
  }
};

// Function to verify the OTP
export const verifyOtpForEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const otpData = req.body;
    const result = await verifyEmailOtp(otpData);
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      //   data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.error || "Failed to verify OTP.",
    });
    next(err);
  }
};
