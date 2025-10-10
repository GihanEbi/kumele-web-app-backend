import { pool } from "../config/db";

interface PaymentData {
  user_id: string;
  product_id?: string;
  amount_usd: number;
  charge_code: string;
  hosted_url: string;
}

export const createCryptoPaymentService = async (data: PaymentData) => {
  const { user_id, product_id, amount_usd, charge_code, hosted_url } = data;
  try {
    const result = await pool.query(
      `
      INSERT INTO crypto_payments (user_id, product_id, amount_usd, charge_code, hosted_url, status)
      VALUES ($1, $2, $3, $4, $5, 'PENDING')
      RETURNING *
      `,
      [user_id, product_id, amount_usd, charge_code, hosted_url]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating crypto payment record:", error);
    throw new Error("Could not create crypto payment record");
  }
};

// This service will be used by our webhook handler
export const updateCryptoPaymentStatusByChargeCodeService = async (
  charge_code: string,
  status: 'COMPLETED' | 'FAILED' | 'EXPIRED'
) => {
  try {
    const result = await pool.query(
      `
      UPDATE crypto_payments
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE charge_code = $2 AND status = 'PENDING' -- Important: only update pending payments
      RETURNING *
      `,
      [status, charge_code]
    );

    if (result.rows.length === 0) {
      // This could mean the payment was already processed or the charge code is invalid.
      console.warn(`No pending payment found or already updated for charge code: ${charge_code}`);
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error updating crypto payment status:", error);
    throw new Error("Could not update crypto payment status");
  }
};