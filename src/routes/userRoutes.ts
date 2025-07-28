import { Router } from "express";
import { getUsers } from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/user", getUsers);

export default userRoutes;