import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import commentRouter from './routes/comment.routes.js'
import postRouter from './routes/post.routes.js'
import cookieParser from 'cookie-parser'




const app = express()
const PORT = 8000 
// Middlewares
app.use(cookieParser())
app.use(express.json())



// Authentication routes
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/comments', commentRouter)
app.use('/api/posts', postRouter)


connectDB()

app.get('/', (req, res) => {
  res.send('Hello from the social server!')
})

app.listen(PORT, () => {
  console.log(`Social server is running on http://localhost:${PORT}`)
})
