import { Request, Response, NextFunction } from "express";
import { sendCustomerSupportRequestService } from "../models/customerSupportModel";

export const sendCustomerSupportRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.UserID;
  const { supportType, supportMessage } = req.body;

  try {
    await sendCustomerSupportRequestService({
      userId,
      supportType,
      supportMessage,
    });

    res.status(200).json({
      success: true,
      message: "Customer support request sent successfully.",
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to send customer support request.",
    });
    next(err);
  }
};
