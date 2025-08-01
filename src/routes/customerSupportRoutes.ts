import { Router } from "express";
import { sendCustomerSupportRequest } from "../controllers/customerSupportController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const customerSupportRouter = Router();
// Route to handle customer support requests
customerSupportRouter.post("/send-support-request", tokenAuthHandler, sendCustomerSupportRequest);

export default customerSupportRouter;
