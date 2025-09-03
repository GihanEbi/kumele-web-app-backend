import { Request, Response, NextFunction } from "express";
import client, { checkoutNodeJssdk } from "../config/paypalClient";
import { saveCardToDbService, listUserCardsFromDbService } from "../models/paymentModel";

// Helper to handle PayPal API errors
const handlePayPalError = (err: any, res: Response) => {
    console.error("PayPal API Error:", err);
    // PayPal API errors often have a status code and a message in the response body.
    if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: "An unexpected error occurred with PayPal." });
};

// Create an order to get an orderID
export const createPaypalOrderController = async (req: Request, res: Response) => {
  const { cartTotal, vault = false } = req.body; // vault is a flag from frontend to save the card
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: cartTotal.toString(),  
        },
      },
    ],
    // If vault is true, instruct PayPal to set up a token for saving the card
    ...(vault && {
        payment_source: {
            card: {
                attributes: {
                    vault: {
                        store_in_vault: 'ON_SUCCESS',
                    },
                },
            },
        },
    }),
  });

  try {
    const order = await client().execute(request);
    res.status(201).json({ success: true, orderID: order.result.id });
  } catch (err: any) {
    handlePayPalError(err, res);
  }
};

// Capture the payment for an order
// export const capturePaypalOrderController = async (req: Request, res: Response) => {
//   const { orderID } = req.body;
//   const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
//   request.requestBody({}); // Must have an empty body

//   try {
//     const capture = await client().execute(request);
//     // Here you would typically save the transaction details to your database
//     res.status(200).json({ success: true, data: capture.result });
//   } catch (err: any) {
//     handlePayPalError(err, res);
//   }
// };
export const capturePaypalOrderController = async (req: Request, res: Response) => {
  const { orderID } = req.body;
  console.log("order capture",orderID);
  
  
  if (!orderID) {
    return res.status(400).json({ success: false, message: "Missing orderID." });
  }

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);

  // --- FIX IS HERE ---
  // The SDK's TypeScript types expect a `payment_source` property, even if it's empty.
  // The API call itself only requires an empty JSON body `{}`, but to satisfy
  // the types, we can provide an empty `payment_source`.
  // This satisfies TypeScript without changing the API request's behavior.
  // request.requestBody({
  //   payment_source: {}
  // });


  try {
    console.log(`--- Attempting to capture order: ${orderID} ---`);
    const capture = await client().execute(request);
    console.log("--- Successfully captured payment ---", capture.result);
    
    // Here you would typically save the transaction details to your database
    res.status(200).json({ success: true, data: capture.result });
  } catch (err: any) {
    console.error(`--- ERROR CAPTURING ORDER ${orderID} ---`);
    console.error(JSON.stringify(err, null, 2));
    handlePayPalError(err, res);
  }
};

// --- SAVED CARDS (VAULT) FLOW ---

// Save a new card's token received from the frontend
export const saveCardController = async (req: Request, res: Response) => {
  // Assuming your tokenAuthHandler adds a user object to the request
  const userId = (req as any).user?.id; 
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
  }

  const { paypal_token_id, card_brand, last4 } = req.body;
  if (!paypal_token_id || !card_brand || !last4) {
      return res.status(400).json({ success: false, message: "Missing required card details." });
  }

  try {
    const newCard = await saveCardToDbService(userId, { paypal_token_id, card_brand, last4 });
    res.status(201).json({ success: true, message: "Card saved successfully.", data: newCard });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to save card." });
  }
};

// Get all of a user's saved cards
export const listUserCardsController = async (req: Request, res: Response) => {
  const userId = req.UserID; // Assuming tokenAuthHandler sets this
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
  }

  try {
    const cards = await listUserCardsFromDbService(userId);
    res.status(200).json({ success: true, data: cards });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to list cards." });
  }
};