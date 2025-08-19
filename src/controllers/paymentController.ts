import { Request, Response, NextFunction } from "express";
import * as paypalService from "../service/paypalService";
import { saveCardTokenService, getUserCardsService } from "../models/paymentModel";

/**
 * Controller to create a PayPal order.
 * The frontend will call this to get an order ID before showing the PayPal button.
 */
export const createPaypalOrderController = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body; // e.g., { amount: "100.00", currency: "USD" }
    if (!amount || !currency) {
      return res.status(400).json({ message: "Amount and currency are required." });
    }

    const order = await paypalService.createOrder(amount, currency);
    // Send back just the order ID to the frontend
    res.status(201).json({ orderID: order.id });

  } catch (error: any) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

/**
 * Controller to capture a payment after user approval on the frontend.
 */
export const capturePaypalOrderController = async (req: Request, res: Response) => {
  try {
    const { orderID } = req.body;
    if (!orderID) {
      return res.status(400).json({ message: "PayPal Order ID is required." });
    }

    const captureData = await paypalService.captureOrder(orderID);

    // IMPORTANT: At this point, the payment is successful.
    // You should now update your own database to reflect that the order has been paid.
    // For example: updateOrderStatus(yourInternalOrderId, 'PAID', captureData.id);

    res.status(200).json({
      message: "Payment successful!",
      transaction: captureData, // Send the full transaction details back
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to capture payment", error: error.message });
  }
};

/**
 * Controller to save a user's card token from PayPal.
 */
export const saveCardController = async (req: Request, res: Response) => {
    try {
        // The frontend gets these details from the PayPal Vault flow
        const { paypal_token, card_type, last4 } = req.body;
        
        // @ts-ignore - Assuming your auth middleware adds a `user` object to `req`
        const user_id = req.user.id;

        if (!paypal_token || !card_type || !last4) {
            return res.status(400).json({ message: "Token, card type, and last4 are required." });
        }

        const newCard = await saveCardTokenService({ user_id, paypal_token, card_type, last4 });

        res.status(201).json({ success: true, message: "Card saved successfully.", data: newCard });

    } catch (error: any) {
        res.status(500).json({ message: "Failed to save card", error: error.message });
    }
};

/**
 * Controller to list a user's saved cards.
 */
export const listUserCardsController = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user_id = req.user.id;
        const cards = await getUserCardsService(user_id);
        res.status(200).json({ success: true, data: cards });
    } catch (error: any) {
        res.status(500).json({ message: "Failed to get cards", error: error.message });
    }
};