import { pool } from "../config/db";

export const savePlisioPayment = async (data: {
  order_id: string;
  amount: number;
  currency: string;
  invoice_url: string;
}) => {
  const { order_id, amount, currency, invoice_url } = data;
  const result = await pool.query(
    `INSERT INTO plisio_payments (order_id, amount, currency, invoice_url)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [order_id, amount, currency, invoice_url]
  );
  return result.rows[0];
};

export const updatePlisioPaymentStatus = async (txn_id: string, status: string) => {
  const result = await pool.query(
    `UPDATE plisio_payments SET status = $1, txn_id = $2 WHERE txn_id = $2 RETURNING *`,
    [status, txn_id]
  );
  return result.rows[0];
};
