import dotenv from "dotenv";

// 1. Load environment variables
dotenv.config();

console.log("--- Starting RAW Coinbase API Test Script ---");

// 2. Read the API Key from .env
const apiKey = process.env.COINBASE_COMMERCE_API_KEY;

// 3. Check the key
if (!apiKey) {
  console.error("!!! FATAL: COINBASE_COMMERCE_API_KEY is not defined in your .env file.");
  process.exit(1);
}

console.log("API Key found. Preparing raw API request...");

// 4. Define the charge data
const chargeData = {
  name: "Raw API Test",
  description: "Direct API call test.",
  local_price: {
    amount: "1.50",
    currency: "USD",
  },
  pricing_type: "fixed_price",
};

// 5. Define an async function to run the test
const runTest = async () => {
  try {
    console.log("\nSending POST request to Coinbase API...");

    const response = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // This is the required header for authentication
        "X-CC-Api-Key": apiKey, 
        // It's good practice to specify the API version
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(chargeData),
    });

    console.log("----------------------------------------");
    console.log("Received response from server.");
    console.log("Status Code:", response.status, response.statusText);

    // Get the response body as JSON
    const responseBody = await response.json();

    if (!response.ok) {
      // If the status code is 4xx or 5xx, it's an error
      console.error("\n!!! REQUEST FAILED !!!");
      console.error("Error Body:", JSON.stringify(responseBody, null, 2));
    } else {
      // If the status is 2xx, it's a success
      console.log("\n✅ SUCCESS! Charge created successfully.");
      console.log("Response Body:", JSON.stringify(responseBody, null, 2));
    }

  } catch (error) {
    console.error("\n!!! A NETWORK OR PARSING ERROR OCCURRED !!!");
    console.error(error);
  }
};

// 6. Run the test
runTest();