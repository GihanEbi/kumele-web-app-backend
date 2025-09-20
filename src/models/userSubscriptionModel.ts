import { pool } from "../config/db";
import { createUserSubscriptionSchema } from "../lib/schemas/schemas";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { CreateUserSubscription } from "../types/types";

export const createUserSubscription = async (
  data: CreateUserSubscription
): Promise<CreateUserSubscription> => {
  // check all user data with schema validation in Joi
  let checkData = validation(createUserSubscriptionSchema, data);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  // check user available in user table
  const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
    data.user_id,
  ]);
  if (userCheck.rows.length === 0) {
    throw new Error("User not found");
  }

  // check subscription available in subscription table
  const subscriptionCheck = await pool.query(
    "SELECT * FROM subscription_data WHERE id = $1",
    [data.subscription_id]
  );
  if (subscriptionCheck.rows.length === 0) {
    throw new Error("Subscription not found");
  }

  // check stripe payment intent is available in stripe_payments table and status succeeded
  if (data.stripe_payment_intent_id) {
    const paymentCheck = await pool.query(
      "SELECT * FROM stripe_payments WHERE stripe_payment_intent_id = $1 AND status = 'succeeded'",
      [data.stripe_payment_intent_id]
    );
    if (paymentCheck.rows.length === 0) {
      throw new Error("Stripe payment not found or not succeeded");
    }
  }

  // check user already have this subscription and it is active
  const userSubscriptionCheck = await pool.query(
    "SELECT * FROM user_subscriptions WHERE user_id = $1 AND subscription_id = $2 AND status = 'active'",
    [data.user_id, data.subscription_id]
  );
  if (userSubscriptionCheck.rows.length > 0) {
    throw new Error("User already has this subscription");
  }
  const { validity_period } = subscriptionCheck.rows[0];

  // Insert the new user subscription into the database
  const query = `
      INSERT INTO user_subscriptions (user_id, subscription_id, start_date, end_date, status, stripe_payment_intent_id)
      VALUES ($1, $2, NOW(), NOW() + $3, 'active', $4)
      RETURNING *; 
    `;
  // The values are the user's ID, the subscription plan's ID, and the interval object itself.
  // The 'pg' driver knows how to handle the interval object correctly.
  const values = [
    data.user_id,
    data.subscription_id,
    validity_period,
    data.stripe_payment_intent_id,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user subscription:", error);
    throw new Error("Error creating user subscription");
  }
};

// get all user subscription
export const getAllUserSubscriptions = async (
  userId: string
): Promise<any[]> => {
  // check user id is available in user table
  const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  if (userCheck.rows.length === 0) {
    throw new Error("User not found");
  }
  // get all user subscriptions
  const query = `
    SELECT * FROM user_subscriptions WHERE user_id = $1
  `;
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error getting user subscription:", error);
    throw new Error("Error getting user subscription");
  }
};

// getUserSubscription by user id and subscription id
export const getUserSubscription = async (
  userId: string,
  subscriptionId: string
): Promise<any> => {
  // check user id is available in user table
  const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  if (userCheck.rows.length === 0) {
    throw new Error("User not found");
  }

  // check subscription id is available in subscription table
  const subscriptionCheck = await pool.query(
    "SELECT * FROM subscription_data WHERE id = $1",
    [subscriptionId]
  );
  if (subscriptionCheck.rows.length === 0) {
    throw new Error("Subscription not found");
  }

  const query = `
    SELECT * FROM user_subscriptions WHERE user_id = $1 AND subscription_id = $2
  `;
  const values = [userId, subscriptionId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting user subscription:", error);
    throw new Error("Error getting user subscription");
  }
};

// activate the deactivated user subscriptions using user id and subscription id
export const activateUserSubscription = async (
  userId: string,
  subscriptionId: string
): Promise<any> => {
  // Check if the user subscription exists and is inactive
  const existingSubscription = await getUserSubscription(
    userId,
    subscriptionId
  );
  if (!existingSubscription || existingSubscription.status !== "inactive") {
    throw new Error("User subscription not found or already active");
  }
  // check subscription available in subscription table
  const subscriptionCheck = await pool.query(
    "SELECT * FROM subscription_data WHERE id = $1",
    [subscriptionId]
  );
  if (subscriptionCheck.rows.length === 0) {
    throw new Error("Subscription not found");
  }
  //   update start date and end date
  const { validity_period } = subscriptionCheck.rows[0];

  const query = `
    UPDATE user_subscriptions
    SET status = 'active', start_date = NOW(), end_date = NOW() + $3::interval
    WHERE user_id = $1 AND subscription_id = $2 AND status = 'inactive'
  `;
  const values = [userId, subscriptionId, validity_period];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error activating user subscription:", error);
    throw new Error("Error activating user subscription");
  }
};

// deactivate the active user subscriptions using user id and subscription id
export const deactivateUserSubscription = async (
  userId: string,
  subscriptionId: string
): Promise<any> => {
  // Check if the user subscription exists and is active
  const existingSubscription = await getUserSubscription(
    userId,
    subscriptionId
  );
  if (!existingSubscription || existingSubscription.status !== "active") {
    throw new Error("User subscription not found or already inactive");
  }

  const query = `
    UPDATE user_subscriptions
    SET status = 'inactive'
    WHERE user_id = $1 AND subscription_id = $2 AND status = 'active'
  `;
  const values = [userId, subscriptionId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error deactivating user subscription:", error);
    throw new Error("Error deactivating user subscription");
  }
};


export const getAllUserSubscriptionsAndUnsubscribes = async (
  userId: string
): Promise<any[]> => {
  // check user id is available in user table
  const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  if (userCheck.rows.length === 0) {
    throw new Error("User not found");
  }

  // get all subscriptions + check if user subscribed
  const query = `
    SELECT 
      sd.id,
      sd.icon_code,
      sd.title,
      sd.description,
      sd.price,
      sd.validity_period,
      sd.created_at,
      CASE 
        WHEN us.user_id IS NOT NULL THEN true
        ELSE false
      END AS "isActive"
    FROM subscription_data sd
    LEFT JOIN user_subscriptions us 
      ON sd.id = us.subscription_id 
     AND us.user_id = $1
  `;

  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error getting user subscriptions:", error);
    throw new Error("Error getting user subscriptions");
  }
};
