import { Router } from "express";
import {
  createPaypalOrderController,
  capturePaypalOrderController,
  saveCardController,
  listUserCardsController
} from "../controllers/paymentController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";  // Your auth middleware

const paymentRouter = Router();

// All payment routes should be protected
paymentRouter.use(tokenAuthHandler);

// --- PAYMENT FLOW ---
// Create an order to get an orderID
paymentRouter.post("/orders/create", createPaypalOrderController);

// Capture the payment for an order
paymentRouter.post("/orders/capture", capturePaypalOrderController);


// --- SAVED CARDS (VAULT) FLOW ---
// Save a new card
paymentRouter.post("/cards/save", saveCardController);

// Get all of a user's saved cards
paymentRouter.get("/cards", listUserCardsController);


export default paymentRouter;