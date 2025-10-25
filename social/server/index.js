import express from "express";
import { createServer } from 'http'; // Required for Socket.io
import { Server } from 'socket.io'; // Required for Socket.io
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from './routes/post.routes.js'
import followRouter from "./routes/followers.routes.js";
import cookieParser from "cookie-parser";
import storyRouter from "./routes/story.routes.js";
import chatRouter from "./routes/chat.routes.js"; // <-- 1. Import the new router
import cors from 'cors'

const app = express();
const PORT = 8000;

const CLIENT_URL = "http://localhost:5173"; // Client URL

// --- Socket.io Setup ---
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Identify and set up a private room for the user 
    const userId = socket.handshake.query.userId;
    if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    }

    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${userId} joined chat room ${chatId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket Disconnected: ${socket.id}`);
    });
});
// --- End Socket.io Setup ---

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded())

// Authentication routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/follow", followRouter);
app.use("/api/story", storyRouter);
app.use("/api/chat", chatRouter);

connectDB();

app.get("/", (req, res) => {
  res.send("Hello from the social server!");
});

app.listen(PORT, () => {
  console.log(`Social server is running on http://localhost:${PORT}`);
  console.log(`Socket.io is listening on port ${PORT}`);
});
