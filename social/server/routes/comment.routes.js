import express from 'express';
import { createComment } from '../controllers/comment.controllers.js';

import isAuth from '../middlewares/isAuth.js'; 

const router = express.Router();


router.post('/create/:postId', isAuth, createComment);

export default router;