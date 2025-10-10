import dotenv from "dotenv";
import coinbase from "coinbase-commerce-node";

// 1. Load environment variables from your .env file
dotenv.config();

console.log("--- Starting Coinbase Test Script ---");

// 2. Read the API Key
const apiKey = process.env.COINBASE_COMMERCE_API_KEY;

// 3. Check if the key was loaded correctly
if (!apiKey) {
  console.error("!!! FATAL: COINBASE_COMMERCE_API_KEY is not defined in your .env file.");
  process.exit(1); // Exit the script
}

console.log(`API Key found. Initializing client...`);

// 4. Initialize the Client
const Client = coinbase.Client;
Client.init(apiKey);
const Charge = coinbase.resources.Charge;

// 5. Hardcode the charge data
const testChargeData = {
  name: "Test Product",
  description: "A test payment from a debug script.",
  local_price: {
    amount: "1.00",
    currency: "USD",
  },
  // FIX: Added 'as const' to satisfy TypeScript's strict typing
  pricing_type: "fixed_price" as const,
  metadata: {
    test_id: "12345",
  },
};

console.log("\nAttempting to create a charge with this data:");
console.log(testChargeData);
console.log("\n----------------------------------------");


// 6. Call the create function using the native callback pattern
Charge.create(testChargeData, (error, response) => {
  console.log("--- Coinbase Callback Executed ---");

  // Check for errors first
  if (error) {
    console.error("!!! AN ERROR OCCURRED !!!");
    console.error("Error Message:", error.message);
    console.error("Full Error Object:", error); // This will show the full stack trace
    return;
  }

  // If there's no error, we should have a response
  if (response) {
    console.log("✅ SUCCESS! Charge created successfully.");
    console.log("Charge Code:", response.code);
    console.log("Payment URL:", response.hosted_url);
  } else {
      console.warn("Callback executed with NO ERROR but also NO RESPONSE. This is unusual.");
  }
});