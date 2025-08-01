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
import applicationRouter from "./routes/applicationRoutes";
import createHobbiesTable from "./data/createHobbiesTable";
import createUserNotificationTable from "./data/createUserNotificationTable";
import createUserCustomerSupportTable from "./data/createUserCustomerSupportTable";
import customerSupportRouter from "./routes/customerSupportRoutes";
import createGuidelinesTable from "./data/createGuidelinesTable";
import guidelinesRouter from "./routes/guidlinesRoutes";
import createTermsConditionTable from "./data/createTermsConditionTable";
import termsCondRoutes from "./routes/termsConditionRoutes";
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
app.use("/api/application", applicationRouter);
app.use("/api/customer-support", customerSupportRouter);
app.use("/api/guidelines", guidelinesRouter);
app.use("/api/terms-conditions", termsCondRoutes);


// Error handling middleware
// app.use(errorHandler);

// create table if it doesn't exist
createUserTable();
createIdTable();
createEmailOtpTable();
createPermissionTable();
createHobbiesTable();
createUserNotificationTable();
createUserCustomerSupportTable();
createGuidelinesTable();
createTermsConditionTable();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
