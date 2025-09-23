import { Router } from "express";
import {
  sendOtpForEmailVerification,
  verifyOtpForEmail,
} from "../controllers/otpController";

import { createUserBetaCodeController } from "../controllers/userBetaCodeController";

const otpRouter = Router();

otpRouter.post("/send-otp-email-verification", sendOtpForEmailVerification);
otpRouter.post("/verify-email", verifyOtpForEmail);
otpRouter.post("/create-user-beta-code", createUserBetaCodeController);

export default otpRouter;
