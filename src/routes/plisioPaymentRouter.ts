import { Router } from "express";
import { createPlisioInvoice, handlePlisioWebhook } from "../controllers/plisioPaymentController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const plisioPaymentRouter = Router();

// Create crypto invoice (protected)
plisioPaymentRouter.post("/create", tokenAuthHandler, createPlisioInvoice);

// Handle webhook (public)
plisioPaymentRouter.post("/webhook", handlePlisioWebhook);

export default plisioPaymentRouter;
