import { Router } from "express";
import {
  sendOtpForEmailVerification,
  verifyOtpForEmail,
} from "../controllers/otpController";

const otpRouter = Router();

otpRouter.post("/send-otp-email-verification", sendOtpForEmailVerification);
otpRouter.post("/verify-email", verifyOtpForEmail);

export default otpRouter;
