import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { pool } from "../config/db";

// This is your Stripe Secret Key.
// The '!' tells TypeScript that we are sure this value will not be null.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil", // Use the required API version
});

/**
 * Creates a Stripe Payment Intent.
 * A PaymentIntent is an object that represents your intent to collect payment from a customer
 * and tracks the lifecycle of the payment process.
 */

// MODIFIED: createPaymentIntent function
export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "A valid amount is required." });
    }

    const amountInCents = Math.round(Number(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
    });

    // --- NEW: Save the initial payment intent to your database ---
    // This creates a record with a 'pending' status.
    const dbQuery = `
      INSERT INTO stripe_payments (stripe_payment_intent_id, amount, currency, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      paymentIntent.id,
      Number(amount), // Save the amount in dollars
      "usd",
      "pending", // The initial status
    ];
    await pool.query(dbQuery, values);
    // -----------------------------------------------------------

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error("Error creating Payment Intent:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent.",
    });
    next(err);
  }
};

// --- NEW: verifyPaymentStatus function ---
/**
 * Verifies the final status of a PaymentIntent with Stripe
 * and updates our database accordingly.
 */
export const verifyPaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment Intent ID is required." });
    }

    // 1. Retrieve the PaymentIntent object from Stripe's API
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // 2. Check if the payment was successful
    if (paymentIntent && paymentIntent.status === "succeeded") {
      // 3. Update the payment record in your database to 'succeeded'
      const dbQuery = `
        UPDATE stripe_payments
        SET status = $1
        WHERE stripe_payment_intent_id = $2 AND status = 'pending'
      `; // We only update if it's still 'pending' to prevent double-processing
      const values = ["succeeded", paymentIntentId];
      const result = await pool.query(dbQuery, values);

      if (result.rowCount === 0) {
        // This might happen if the webhook already updated it, which is fine.
        console.log(`Payment [${paymentIntentId}] was already processed.`);
        return res
          .status(200)
          .json({ success: true, message: "Payment was already verified." });
      }

      // --- TODO: FULFILL THE ORDER ---
      // This is where you would:
      // - Send a confirmation email
      // - Start the shipping process
      // - Log the successful order
      console.log(
        `Payment [${paymentIntentId}] verified successfully and database updated.`
      );
      // -----------------------------

      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully." });
    } else {
      // The payment was not successful
      return res
        .status(400)
        .json({
          success: false,
          message: "Payment not successful or still pending.",
        });
    }
  } catch (err: any) {
    console.error("Error verifying payment:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment.",
    });
    next(err);
  }
};
