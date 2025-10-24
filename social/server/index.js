import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from './routes/post.routes.js'
import followRouter from "./routes/followers.routes.js";
import cookieParser from "cookie-parser";
import storyRouter from "./routes/story.routes.js";
import cors from 'cors'
import commentRouter from "./routes/comment.routes.js";

const app = express();
const PORT = 8000;
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
app.use("/api/comment", commentRouter);

connectDB();

app.get("/", (req, res) => {
  res.send("Hello from the social server!");
});

app.listen(PORT, () => {
  console.log(`Social server is running on http://localhost:${PORT}`);
});
