import { Router } from "express";
import {
  changePassword,
  createOrUpdateUserNotifications,
  deleteUserAccount,
  getUserData,
  getUserEventCategories,
  getUserNotificationStatus,
  googleSignIn,
  loginUser,
  registerUser,
  resetPassword,
  sendPasswordResetEmail,
  setTwoFactorAuthentication,
  setUserName,
  setUserSelectedEventCategories,
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
userRoutes.post("/send-password-reset-email", sendPasswordResetEmail); // Updated route for forgot password
userRoutes.post("/reset-password", resetPassword); // New route for resetting password
userRoutes.post("/google-signin", googleSignIn); // New route for Google Sign-In
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
userRoutes.post(
  "/set-user-event-categories",
  tokenAuthHandler,
  setUserSelectedEventCategories
);
userRoutes.get(
  "/get-user-event-categories",
  tokenAuthHandler,
  getUserEventCategories
);

export default userRoutes;
