import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
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
import createBlogTable from "./data/createBlogTable";
import blogRoute from "./routes/blogRoutes";
import createBlogLikeTable from "./data/createBlogLikeTable";
import createBlogCommentTable from "./data/createBlogCommentTable";
import createSubscriptionDataTable from "./data/createSubscriptionDataTable";
import subscriptionDataRouter from "./routes/subscriptionDataRoutes";
import createGuestTicketsTable from "./data/createGuestTicketsTable";
import guestTicketRouter from "./routes/guestTicketRoute";
import createUserSubscriptionTable from "./data/createUserSuscriptionTable";
import createAdvertTable from "./data/createAdvertTable";
import advertRoute from "./routes/advertRoute";
import chatRouter from "./routes/chatRoutes";

import { createMessageService, IMessage } from "./models/chatModel";
import createMessagesTable from "./data/createChatTable";
import createCardsTable from "./data/createCardsTable";
import paymentRouter from "./routes/paymentRouter";
import createSavedCardsTable from "./data/createSavedCardsTable";
import passkeyRouter from "./routes/passkeyRoute";
import createPasskeysTable from "./data/createPasskeyTable";
import { Server as SocketIoServer } from "socket.io";
import createAdvertLanguageTable from "./data/createAdvertLanguageTable";
import createAdvertDailyBudgetTable from "./data/createAdvertDailyBudgetTable";
import createAdvertRegionTable from "./data/createAdvertRegionTable";
import createAdvertCallToActionTable from "./data/createAdvertCallToActionTable";
import stripeRouter from "./routes/stripeRoute";
import createStripePaymentsTable from "./data/createStripePaymentsTable";
import createUserAppNotificationTable from "./data/createUserAppNotificationTable";
import createNotificationTable from "./data/createNotificationTable";
import notificationRoute from "./routes/notificationRoutes";

const PORT = process.env.PORT || 5001; // Your defined port

const app = express();

const server = http.createServer(app); // Create the HTTP server and pass the Express app

// Configure CORS for Socket.io and HTTP
const io = new SocketIoServer(server, {
  // Socket.io attached to the 'server' instance
  cors: {
    origin: "http://109.199.125.163:3000",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ... (Your Socket.io connection handling logic)
// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`); // <--- This should log

  // Authenticate socket connection if needed (e.g., using JWT from socket.handshake.auth.token)
  // ... (commented-out auth block)

  socket.on("joinRoom", (eventId: string) => {
    socket.join(eventId);
    console.log(`User ${socket.id} joined room: ${eventId}`); // <--- This should log
  });

  socket.on("leaveRoom", (eventId: string) => {
    socket.leave(eventId);
    console.log(`User ${socket.id} left room: ${eventId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
  });
});

// middlewares (order matters for some)
app.use((req, res, next) => {
  // @ts-ignore
  req.io = io; // This needs to be defined for Express's Request type
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// routes
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRouter);
app.use("/api/customer-support", customerSupportRouter);
app.use("/api/guidelines", guidelinesRouter);
app.use("/api/terms-conditions", termsCondRoutes);
app.use("/api/event-category", eventCategoryRouter);
app.use("/api/landing-page", landingPageRouter);
app.use("/api/events", eventRoutes);
app.use("/api/blogs", blogRoute);
app.use("/api/subscriptions", subscriptionDataRouter);
app.use("/api/guest-tickets", guestTicketRouter);
app.use("/api/adverts", advertRoute);
app.use("/api/chat", chatRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/passkeys", passkeyRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/notifications", notificationRoute);

// Error handling middleware (place this after all routes)
app.use(errorHandler); // <-- Move this after all routes

// create table if it doesn't exist (these calls are fine)
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
createBlogTable();
createBlogLikeTable();
createBlogCommentTable();
createSubscriptionDataTable();
createGuestTicketsTable();
createUserSubscriptionTable();
createAdvertTable();
createMessagesTable();
createCardsTable();
createSavedCardsTable();
createPasskeysTable();
createAdvertLanguageTable();
createAdvertRegionTable();
createAdvertDailyBudgetTable();
createAdvertCallToActionTable();
createStripePaymentsTable();
createUserAppNotificationTable();
createNotificationTable();

// CHANGE THIS LINE: Listen using the 'server' instance, not 'app'
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} with Socket.io`);
});
