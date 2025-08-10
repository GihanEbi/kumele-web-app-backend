import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { guestTicketSchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { GuestTicket } from "../types/types";

export const createGuestTicket = async (
  data: GuestTicket
): Promise<GuestTicket> => {
  // check all user data with schema validation in Joi
  let checkData = validation(guestTicketSchema, data);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  try {
    // Create a new ID for the guest ticket
    const newId = await createId(id_codes.idCode.guestTicket);
    const query = `
        INSERT INTO guest_tickets (id, icon_code, title, description, price)
        VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [
      newId,
      data.icon_code,
      data.title,
      data.description,
      data.price,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating guest ticket:", error);
    throw new Error("Error creating guest ticket");
  }
};

// get all guest tickets
export const getAllGuestTickets = async (): Promise<GuestTicket[]> => {
  try {
    const query = `
      SELECT * FROM guest_tickets
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching guest tickets:", error);
    throw new Error("Error fetching guest tickets");
  }
};

// get guest ticket by id
export const getGuestTicketById = async (
  id: string
): Promise<GuestTicket | null> => {
  try {
    const query = `
      SELECT * FROM guest_tickets WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching guest ticket by id:", error);
    throw new Error("Error fetching guest ticket by id");
  }
};

// update guest ticket
export const updateGuestTicket = async (
  id: string,
  data: Partial<GuestTicket>
): Promise<GuestTicket | null> => {
  // Validate the incoming data against the schema
  let checkData = validation(guestTicketSchema, data);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }

  try {
    const query = `
      UPDATE guest_tickets
      SET icon_code = $1, title = $2, description = $3, price = $4
      WHERE id = $5
      RETURNING *
    `;
    const values = [
      data.icon_code,
      data.title,
      data.description,
      data.price,
      id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error updating guest ticket:", error);
    throw new Error("Error updating guest ticket");
  }
};
