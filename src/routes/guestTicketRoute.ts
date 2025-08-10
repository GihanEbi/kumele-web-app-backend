import { Router } from "express";
import { uploadEventCategoryIcon } from "../config/multerSvgConfig";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import {
  createGuestTicketController,
  getAllGuestTicketsController,
  getGuestTicketByIdController,
  updateGuestTicketController,
} from "../controllers/guestTickeController";

const guestTicketRouter = Router();

guestTicketRouter.post(
  "/create-guest-ticket",
  tokenAuthHandler,
  uploadEventCategoryIcon,
  createGuestTicketController
);

guestTicketRouter.get(
  "/get-all-guest-tickets",
  tokenAuthHandler,
  getAllGuestTicketsController
);

guestTicketRouter.get(
  "/get-guest-ticket-by-id/:id",
  tokenAuthHandler,
  getGuestTicketByIdController
);

guestTicketRouter.put(
  "/update-guest-ticket-by-id/:id",
  tokenAuthHandler,
  uploadEventCategoryIcon,
  updateGuestTicketController
);

export default guestTicketRouter;
