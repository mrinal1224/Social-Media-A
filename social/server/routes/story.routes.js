import express from "express";
import {
  createStory,
  getAllStories,
  getUserStories,
  viewStory,
  getMyStories,
} from "../controllers/story.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const storyRouter = express.Router();

// Create a new story
storyRouter.post("/create", isAuth, upload.single("mediaUrl"), createStory);

// Get all active stories
storyRouter.get("/all", isAuth, getAllStories);

// Get current user's stories
storyRouter.get("/my-stories", isAuth, getMyStories);

// Get stories by specific user
storyRouter.get("/user/:userId", isAuth, getUserStories);

// View a story (mark as viewed)
storyRouter.post("/view/:storyId", isAuth, viewStory);

// Delete a story
// storyRouter.delete("/:storyId", isAuth, deleteStory);

export default storyRouter;