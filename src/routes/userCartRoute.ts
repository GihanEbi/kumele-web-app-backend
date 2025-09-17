import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import {
  addItemToCartController,
  getUserCartController,
  removeItemFromCartController,
} from "../controllers/userCartController";

const userCartRoute = Router();

userCartRoute.post("/add-item", tokenAuthHandler, addItemToCartController);
userCartRoute.get("/get-user-cart", tokenAuthHandler, getUserCartController);
userCartRoute.delete(
  "/remove-item/:id",
  tokenAuthHandler,
  removeItemFromCartController
);
export default userCartRoute;
