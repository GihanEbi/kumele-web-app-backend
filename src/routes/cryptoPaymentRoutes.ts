import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import { createCharge } from "../controllers/cryptoPaymentController";
import express from 'express';

const cryptoPaymentRouter = Router();

// Endpoint for your frontend to call to start a payment
// This is protected because we need to know which user is paying
cryptoPaymentRouter.post("/create-charge", tokenAuthHandler, createCharge);

// Endpoint for Coinbase to send webhook notifications to
// This route CANNOT have JSON parsing middleware enabled before the controller.
// We use express.raw() to get the raw request body for signature verification.
// It is NOT protected by tokenAuthHandler because it's a server-to-server call.
// cryptoPaymentRouter.post(
//   "/webhook",
//   express.raw({ type: 'application/json' }), // Important middleware!
//   handleWebhook
// );

export default cryptoPaymentRouter;