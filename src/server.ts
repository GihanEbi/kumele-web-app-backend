import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";
import createUserTable from "./data/createUserTable";
import createIdTable from "./data/createIdTable";
import createEmailOtpTable from "./data/createEmailOtpTable";
import otpRouter from "./routes/otpRoutes";
import createPermissionTable from "./data/createPermissionTable";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// routes
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRouter)

// Error handling middleware
// app.use(errorHandler);

// create table if it doesn't exist
createUserTable();
createIdTable();
createEmailOtpTable();
createPermissionTable();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
