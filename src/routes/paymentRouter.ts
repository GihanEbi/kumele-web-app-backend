import { Router } from "express";
import {
  createPaypalOrderController,
  capturePaypalOrderController,
  saveCardController,
  listUserCardsController,
} from "../controllers/paymentController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler"; // Your auth middleware

const paymentRouter = Router();

// --- STANDARD PAYMENT FLOW ---

// Create an order to get an orderID
paymentRouter.post("/orders/create", tokenAuthHandler, createPaypalOrderController);

// Capture the payment for an order
paymentRouter.post("/orders/capture", tokenAuthHandler, capturePaypalOrderController);


// --- SAVED CARDS (VAULT) FLOW ---

// Save a new card (requires user to be logged in)
paymentRouter.post("/cards/save", tokenAuthHandler, saveCardController);

// Get all of a user's saved cards (requires user to be logged in)
paymentRouter.get("/cards", tokenAuthHandler, listUserCardsController);

export default paymentRouter;