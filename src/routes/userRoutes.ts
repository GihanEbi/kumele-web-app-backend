import { Router } from "express";
import {
  changePassword,
  createOrUpdateUserNotifications,
  deleteUserAccount,
  getUserData,
  getUserHobbies,
  getUserNotificationStatus,
  loginUser,
  registerUser,
  setTwoFactorAuthentication,
  setUserHobbies,
  setUserName,
  updateProfileAbout,
  updateUserPermissions,
  uploadUserProfile,
  verifyTwoFactorAuthentication,
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
userRoutes.put(
  "/profile-picture",
  tokenAuthHandler,
  dynamicUpload.single("profilePicture"),
  uploadUserProfile
);
userRoutes.put("/profile-about", tokenAuthHandler, updateProfileAbout);
userRoutes.post(
  "/update-notifications",
  tokenAuthHandler,
  createOrUpdateUserNotifications
);
userRoutes.get("/user-data", tokenAuthHandler, getUserData);
userRoutes.get(
  "/user-notification-status",
  tokenAuthHandler,
  getUserNotificationStatus
);
userRoutes.post("/change-password", tokenAuthHandler, changePassword);
userRoutes.post(
  "/set-two-factor-authentication",
  tokenAuthHandler,
  setTwoFactorAuthentication
);
userRoutes.post(
  "/verify-two-factor-authentication",
  tokenAuthHandler,
  verifyTwoFactorAuthentication
);
userRoutes.delete("/delete-account", tokenAuthHandler, deleteUserAccount);
userRoutes.post("/set-user-hobbies", tokenAuthHandler, setUserHobbies);
userRoutes.get("/get-user-hobbies", tokenAuthHandler, getUserHobbies);

export default userRoutes;
