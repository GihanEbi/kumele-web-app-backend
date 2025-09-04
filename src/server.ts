import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
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

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// middlewares
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// --- Socket.io Integration ---
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js app's URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`✨ User connected: ${socket.id}`);

  // Event to join a chat room based on eventId
  socket.on("joinRoom", (eventId: string) => {
    socket.join(eventId);
    console.log(`User ${socket.id} joined room ${eventId}`);
  });

  // Event to handle sending a message
  socket.on("sendMessage", async (message: IMessage) => {
    try {
      // 1. Save the message to the database
      const savedMessage = await createMessageService(message);

      // 2. Broadcast the saved message to everyone in that specific event room
      io.to(message.event_id).emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("Error handling message:", error);
      // Optional: emit an error back to the sender
      socket.emit("messageError", "Failed to send message.");
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`🔥 User disconnected: ${socket.id}`);
  });
});

// !!! --- NEW MIDDLEWARE --- !!!
// This middleware makes the `io` instance available on `req.io` in all our controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
