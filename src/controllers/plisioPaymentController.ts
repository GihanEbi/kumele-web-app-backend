import { Request, Response } from "express";
import axios from "axios";
import qs from "qs"; // npm install qs

import dotenv from "dotenv";
import {
  savePlisioPayment,
  updatePlisioPaymentStatus,
} from "../models/plisioPaymentModel";
dotenv.config();

export const createPlisioInvoice = async (req: Request, res: Response) => {
  try {
    const { amount, currency, order_id } = req.body;
    if (!amount || !currency || !order_id) {
      return res.status(400).json({ error: "Missing payment fields" });
    }
    // viR-TIQALxdXhIWqImFFqXZDLs9ERALsQLK9Q61Ur7yJfpWcrCd3mmCDli9mVGdS
    // create order id 
    const orderId = `order_${Date.now()}`;

    const response = await axios.get("https://api.plisio.net/api/v1/invoices/new", {
      params: {
        // api_key: "QKGNG81CULb_JO6JvIbDn9vZ1c-zhQjJTAlSVIZ9MFUARZn2urErqXZRXRa5gp3T",
        api_key: "viR-TIQALxdXhIWqImFFqXZDLs9ERALsQLK9Q61Ur7yJfpWcrCd3mmCDli9mVGdS",
        order_name: `Order #${orderId}`,
        order_number: orderId,
        source_currency: currency,
        source_amount: amount,
        callback_url:"https://yourdomain.com/api/plisio/callback",
      },
    });


    const invoice = response.data?.data;

    // Save to database
    const saved = await savePlisioPayment({
      order_id,
      amount,
      currency,
      invoice_url: invoice.invoice_url,
    });

    return res.status(200).json({
      success: true,
      message: "Invoice created successfully",
      data: { invoice_url: invoice.invoice_url, payment: saved },
    });
  } catch (error: any) {
    console.error("Error creating Plisio invoice:", error);
    res.status(500).json({ error: "Failed to create Plisio invoice" });
  }
};

// webhook handler
export const handlePlisioWebhook = async (req: Request, res: Response) => {
  try {
    const { txn_id, status, order_number } = req.body;
    console.log("Plisio Webhook:", req.body);

    await updatePlisioPaymentStatus(txn_id, status);

    // Optionally, you can update related order record here

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Webhook failed");
  }
};
