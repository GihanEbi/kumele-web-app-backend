import { Router } from "express";
import {
  loginUser,
  registerUser,
  setUserName,
  updateUserPermissions,
} from "../controllers/userController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const userRoutes = Router();

userRoutes.post("/login", loginUser);
userRoutes.post("/register", registerUser);
// Add other user-related routes here
userRoutes.post("/update-permissions", tokenAuthHandler, updateUserPermissions);
userRoutes.post("/set-username", tokenAuthHandler, setUserName);

export default userRoutes;
