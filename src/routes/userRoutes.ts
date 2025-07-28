import { Router } from "express";
import { getUsers, registerUser } from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/user", getUsers);
userRoutes.post("/register", registerUser);

export default userRoutes;
