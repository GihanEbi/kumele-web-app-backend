import { Router } from "express";
import {
  loginUser,
  registerUser,
  setUserName,
  updateUserPermissions,
  uploadUserProfile,
} from "../controllers/userController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

// Import the new dynamic uploader
import { dynamicUpload } from "../config/multer.config"; 

const userRoutes = Router();

userRoutes.post("/login", loginUser);
userRoutes.post("/register", registerUser);
// Add other user-related routes here
userRoutes.post("/update-permissions", tokenAuthHandler, updateUserPermissions);
userRoutes.post("/set-username", tokenAuthHandler, setUserName);

// UPDATED ROUTE:
// We use the new `dynamicUpload` middleware here.
// The field name for the file is still 'profilePicture'.
userRoutes.put(
  "/profile-picture",
  tokenAuthHandler,
  dynamicUpload.single("profilePicture"), 
  uploadUserProfile
);

export default userRoutes;