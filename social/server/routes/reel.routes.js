import express from "express";
import { uploadReel, getAllReels } from "../controllers/reel.controllers.js";
import { upload } from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";

const reelRouter = express.Router();

// Upload a reel using the same multipart field name used by post uploads.
reelRouter.post("/uploadReel", isAuth, upload.single("mediaUrl"), uploadReel);

// Get reels for the logged-in user and followed users.
reelRouter.get("/getAllReels", isAuth, getAllReels);

export default reelRouter;
