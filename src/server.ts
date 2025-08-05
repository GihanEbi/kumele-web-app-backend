import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";
import createUserTable from "./data/createUserTable";
import createIdTable from "./data/createIdTable";
import createEmailOtpTable from "./data/createEmailOtpTable";
import otpRouter from "./routes/otpRoutes";
import createPermissionTable from "./data/createPermissionTable";
import createUserNotificationTable from "./data/createUserNotificationTable";
import createUserCustomerSupportTable from "./data/createUserCustomerSupportTable";
import customerSupportRouter from "./routes/customerSupportRoutes";
import createGuidelinesTable from "./data/createGuidelinesTable";
import guidelinesRouter from "./routes/guidlinesRoutes";
import createTermsConditionTable from "./data/createTermsConditionTable";
import termsCondRoutes from "./routes/termsConditionRoutes";
import createLandingPageLinksTable from "./data/createLandingPageLinksTable";
import landingPageRouter from "./routes/landingPageRoutes";
import createAboutUsTable from "./data/createAboutUsTable";
import createLandingPageDetailsTable from "./data/createLandingPageDetailsTable";
import eventCategoryRouter from "./routes/eventCategoryRouters";
import createEventCategoriesTable from "./data/createEventCategoriesTable";
import createUserEventCategoryTable from "./data/createUserEventCategoryTable";
import createEventTable from "./data/createEventTable";
import eventRoutes from "./routes/eventRoutes";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// routes
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRouter);
app.use("/api/customer-support", customerSupportRouter);
app.use("/api/guidelines", guidelinesRouter);
app.use("/api/terms-conditions", termsCondRoutes);
app.use("/api/event-category", eventCategoryRouter);
app.use("/api/landing-page",landingPageRouter)
app.use("/api/events", eventRoutes);

// Error handling middleware
// app.use(errorHandler);

// create table if it doesn't exist
createUserTable();
createIdTable();
createEmailOtpTable();
createPermissionTable();
createEventCategoriesTable();
createUserNotificationTable();
createUserCustomerSupportTable();
createGuidelinesTable();
createTermsConditionTable();
createUserEventCategoryTable();
createLandingPageLinksTable();
createAboutUsTable();
createLandingPageDetailsTable();
createEventTable();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
