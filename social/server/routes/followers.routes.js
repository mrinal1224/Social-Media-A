import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { 
  followUser, 
  unfollowUser, 
  getFollowStatus 
} from "../controllers/follow.controllers.js";

const followRouter = express.Router();

// Follow a user
followRouter.post("/:userId", isAuth, followUser);

// Unfollow a user
followRouter.post("/unfollow/:userId", isAuth, unfollowUser);

// Get follow status
followRouter.get("/status/:userId", isAuth, getFollowStatus);

export default followRouter;