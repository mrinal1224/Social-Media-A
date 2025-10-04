import express from "express";
import {
  editProfile,
  getCurrentUser,
  getProfile,getSuggestedUsers
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";


const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/getprofile/:userName", getProfile);
userRouter.post(
  "/editprofile/",
  isAuth,
  upload.single("profileImage"),
  editProfile
);

userRouter.get(
  "/suggested",
  isAuth,
  getSuggestedUsers
);

export default userRouter;
