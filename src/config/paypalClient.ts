import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();

const configureEnvironment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal client ID or secret is missing from .env");
  }

  // Use SandboxEnvironment for testing, or LiveEnvironment for production
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
};

const client = () => {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
};

export default client;
export { checkoutNodeJssdk };