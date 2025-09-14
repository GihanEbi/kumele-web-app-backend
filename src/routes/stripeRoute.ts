import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import { createPaymentIntent, verifyPaymentStatus } from "../controllers/stripeController";

const stripeRouter = Router();

// This route creates the payment intent. The frontend will call this first.
// It's protected to ensure only logged-in users can create payments.
stripeRouter.post(
  "/create-payment-intent",
  tokenAuthHandler,
  createPaymentIntent
);

stripeRouter.post(
  "/verify-payment",
  tokenAuthHandler,
  verifyPaymentStatus
);

export default stripeRouter;