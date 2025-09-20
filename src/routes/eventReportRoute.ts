import { Router } from "express";
import {
  getEventReportReasonsController,
  createEventReportController,
  getAllEventReportsController,
  getEventReportsByEventIdController,
  getEventReportsByUserIdController,
} from "../controllers/eventReportController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const eventReportRouter = Router();

eventReportRouter.get(
  "/get-reasons",
  tokenAuthHandler,
  getEventReportReasonsController
);
eventReportRouter.post(
  "/create-report",
  tokenAuthHandler,
  createEventReportController
);
eventReportRouter.get(
  "/get-all",
  tokenAuthHandler,
  getAllEventReportsController
);
eventReportRouter.get(
  "/get-by-event/:eventId",
  tokenAuthHandler,
  getEventReportsByEventIdController
);
eventReportRouter.get(
  "/get-by-user/:userId",
  tokenAuthHandler,
  getEventReportsByUserIdController
);

export default eventReportRouter;
