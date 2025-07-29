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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: err,
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
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "OTP verification failed",
      error: err,
    });
    next(err);
  }
};
