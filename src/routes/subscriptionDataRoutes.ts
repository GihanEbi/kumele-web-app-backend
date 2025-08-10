import { Router } from "express";
import { uploadEventCategoryIcon } from "../config/multerSvgConfig";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import {
  createSubscriptionController,
  getAllSubscriptionsController,
  getSubscriptionByIdController,
  updateSubscriptionByIdController,
} from "../controllers/subscriptionDataController";
import {
  activateUserSubscriptionController,
  createUserSubscriptionController,
  getAllUserSubscriptionsController,
} from "../controllers/userSubscriptionController";

const subscriptionDataRouter = Router();

subscriptionDataRouter.post(
  "/create-subscription-data",
  tokenAuthHandler,
  uploadEventCategoryIcon,
  createSubscriptionController
);
subscriptionDataRouter.get(
  "/get-all-subscription-data",
  tokenAuthHandler,
  getAllSubscriptionsController
);
subscriptionDataRouter.get(
  "/get-subscription-data-by-id/:id",
  tokenAuthHandler,
  getSubscriptionByIdController
);
subscriptionDataRouter.put(
  "/update-subscription-data-by-id/:id",
  tokenAuthHandler,
  uploadEventCategoryIcon,
  updateSubscriptionByIdController
);

// create user subscription
subscriptionDataRouter.post(
  "/create-user-subscription",
  tokenAuthHandler,
  createUserSubscriptionController
);

// get all user subscriptions
subscriptionDataRouter.get(
  "/get-all-user-subscriptions",
  tokenAuthHandler,
  getAllUserSubscriptionsController
);

// activate deactivated subscription
subscriptionDataRouter.post(
  "/activate-user-subscription/:subscriptionId",
  tokenAuthHandler,
  activateUserSubscriptionController
);

export default subscriptionDataRouter;
