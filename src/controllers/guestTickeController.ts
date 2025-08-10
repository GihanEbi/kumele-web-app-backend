import { Request, Response, NextFunction } from "express";
import {
  createGuestTicket,
  getAllGuestTickets,
  getGuestTicketById,
  updateGuestTicket,
} from "../models/guestTicketModel";

export const createGuestTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const guestTicketData = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "SVG icon file is required." });
    }
    guestTicketData.icon_code = file.buffer.toString("utf-8");
    const guestTicket = await createGuestTicket(guestTicketData);
    return res.status(201).json({
      message: "Guest ticket created successfully!",
      guestTicket: guestTicket,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Guest ticket creation failed",
    });
    next(err);
  }
};

export const getAllGuestTicketsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const guestTickets = await getAllGuestTickets();
    return res.status(200).json({
      success: true,
      guestTickets: guestTickets,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve guest tickets",
    });
    next(err);
  }
};

export const getGuestTicketByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const guestTicket = await getGuestTicketById(id);
    if (!guestTicket) {
      return res.status(404).json({
        success: false,
        message: "Guest ticket not found",
      });
    }
    return res.status(200).json({
      success: true,
      guestTicket: guestTicket,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to retrieve guest ticket",
    });
    next(err);
  }
};

export const updateGuestTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "SVG icon file is required." });
    }
    updatedData.icon_code = file.buffer.toString("utf-8");
    const guestTicket = await updateGuestTicket(id, updatedData);
    if (!guestTicket) {
      return res.status(404).json({
        success: false,
        message: "Guest ticket not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Guest ticket updated successfully!",
      guestTicket: guestTicket,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to update guest ticket",
    });
    next(err);
  }
};
