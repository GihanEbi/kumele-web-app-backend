import { Request, Response, NextFunction } from "express";
import coinbase from 'coinbase-commerce-node';
import { resources } from 'coinbase-commerce-node'; // Import the 'resources' type
import {
  createCryptoPaymentService,
  updateCryptoPaymentStatusByChargeCodeService,
} from "../models/cryptoPaymentModel";

const Client = coinbase.Client;
Client.init(process.env.COINBASE_COMMERCE_API_KEY!);

const Charge = coinbase.resources.Charge;
const Webhook = coinbase.Webhook;

export const createCharge = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const userId = req.UserID;
  const { amount_usd, product_id, product_name, description } = req.body;

  if (!amount_usd || !product_name || !userId) {
    return res.status(400).json({ error: "Amount, product name, and user ID are required." });
  }

  try {
    const chargeData = {
      name: product_name,
      description: description || `Payment for ${product_name}`,
      local_price: {
        amount: amount_usd,
        currency: 'USD',
      },
      pricing_type: 'fixed_price' as const,
      metadata: {
        user_id: userId,
        product_id: product_id || 'N/A',
      },
    };

    // --- THIS IS THE FIX ---
    // Wrap the callback function in a new Promise
    const charge = await new Promise<resources.Charge>((resolve, reject) => {
      Charge.create(chargeData, (error, response) => {
        if (error) {
          // If Coinbase returns an error, reject the promise
          return reject(error);
        }
        // If it's successful, resolve the promise with the response
        resolve(response);
      });
    });
    // --- END OF FIX ---

    // Now, 'charge' will be a valid object, not undefined
    console.log("Coinbase charge created successfully:", charge.code);

    await createCryptoPaymentService({
      user_id: userId,
      product_id,
      amount_usd,
      charge_code: charge.code,
      hosted_url: charge.hosted_url,
    });

    res.status(201).json({
      success: true,
      message: "Charge created successfully.",
      payment_url: charge.hosted_url,
    });

  } catch (err: any) {
    console.error("!!! FAILED TO CREATE COINBASE CHARGE !!!");
    console.error(err); 
    
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create crypto payment charge.",
      // Include more error detail in development for easier debugging
      error_details: process.env.NODE_ENV === 'development' ? err : undefined,
    });
    
    // FIX for "Cannot set headers": Remove next(err) since we already sent a response.
    // next(err); 
  }
};


// The webhook handler remains the same as the previous version
// export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
//     console.log("--- Received /webhook request ---");
//     const signature = req.headers['x-cc-webhook-signature'] as string;
//     const rawBody = req.body; 

//     if (!signature || !rawBody) {
//         console.error("Webhook missing signature or body");
//         return res.status(400).send("Webhook missing signature or body.");
//     }

//     try {
//         const event = Webhook.verifyEventBody(
//             rawBody.toString(),
//             signature,
//             process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!
//         );

//         console.log(`Webhook verified. Event type: ${event.type}`);

//         if (event.type === 'charge:confirmed') {
//             const updatedPayment = await updateCryptoPaymentStatusByChargeCodeService(event.data.code, 'COMPLETED');
//             if (updatedPayment) {
//                 console.log(`Database updated for user ${updatedPayment.user_id}`);
//             }
//         } else if (event.type === 'charge:failed') {
//             await updateCryptoPaymentStatusByChargeCodeService(event.data.code, 'FAILED');
//         }

//         res.status(200).send('Webhook received successfully.');

//     } catch (error: any) {
//         console.error("!!! WEBHOOK VERIFICATION FAILED !!!");
//         console.error(error.message);
//         res.status(400).send('Webhook Error: ' + error.message);
//     }
// };