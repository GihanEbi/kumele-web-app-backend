import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();

const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

  if (process.env.PAYPAL_API_MODE === "live") {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
  // Default to Sandbox
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

// Returns an authenticated PayPal client instance
const paypalClient = () => {
  return new paypal.core.PayPalHttpClient(environment());
};


/**
 * Creates a PayPal order.
 * @param amount - The amount for the order (e.g., "10.99")
 * @param currency - The currency code (e.g., "USD")
 * @returns The created order details, including the order ID.
 */
export const createOrder = async (amount: string, currency: string) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount,
        },
      },
    ],
  });

  try {
    const order = await paypalClient().execute(request);
    console.log("Created PayPal Order:", order.result);
    return order.result;
  } catch (err) {
    console.error("Error creating PayPal order:", err);
    throw new Error("Failed to create PayPal order.");
  }
};


/**
 * Captures the payment for a given PayPal order ID.
 * This is called after the user has approved the payment on the frontend.
 * @param orderID - The ID of the order to capture.
 * @returns The captured payment details.
 */
export const captureOrder = async (orderID: string) => {
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({}); // request body is empty for capture

  try {
    const capture = await paypalClient().execute(request);
    console.log("Captured PayPal Payment:", capture.result);
    // You can now save capture.result.id (the transaction ID) to your database
    return capture.result;
  } catch (err) {
    console.error("Error capturing PayPal order:", err);
    throw new Error("Failed to capture PayPal payment.");
  }
};