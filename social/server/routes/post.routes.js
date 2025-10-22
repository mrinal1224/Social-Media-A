import express from 'express'
import { uploadPost , getAllPosts  , like, viewPost, comment } from '../controllers/post.controllers.js'
import { upload } from '../middlewares/multer.js'
import isAuth from '../middlewares/isAuth.js'



const postRouter = express.Router()


postRouter.post('/uploadPost',isAuth , upload.single('mediaUrl'), uploadPost )
postRouter.get("/getAllPosts" , isAuth ,getAllPosts );
postRouter.post("/like/:postId", isAuth, like);
postRouter.post("/comment/:postId", isAuth, comment);
postRouter.post("/view/:postId", isAuth, viewPost);




export default postRouter
