import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { customerSupportSchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { CustomerSupportRequest } from "../types/types";

export const sendCustomerSupportRequestService = async (
  requestData: CustomerSupportRequest
): Promise<void> => {
  const { userId, supportType, supportMessage } = requestData;
  // Validate the request data against the customer support schema
  let checkData = validation(customerSupportSchema, requestData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  try {
    // Generate a unique ID for the support request
    const supportRequestId = await createId(id_codes.idCode.customerSupport);
    console.log("Generated support request ID:", supportRequestId);
    

    // Insert the support request into the database
    const result = await pool.query(
      `
    INSERT INTO user_customer_support (id, user_id, support_type, support_message)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
      [supportRequestId, userId, supportType, supportMessage]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error sending customer support request:", error);
    throw new Error("Error sending customer support request");
  }
};
