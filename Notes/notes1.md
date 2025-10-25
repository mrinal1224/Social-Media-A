# Social Media Application - Development Notes (September 8th Session)

## Project Overview
A full-stack social media application called "Scaler Gram" built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, modern UI design, and secure API implementation.

---

## Part 1: Backend Development

### 1. Project Structure & Setup

#### Backend Directory Structure
```
social/
├── server/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── token.js       # JWT token generation
│   ├── controllers/
│   │   ├── auth.controllers.js   # Authentication logic
│   │   └── user.controllers.js   # User-related logic
│   ├── middlewares/
│   │   └── isAuth.js      # Authentication middleware
│   ├── models/
│   │   └── user.model.js  # User schema
│   ├── routes/
│   │   ├── auth.routes.js # Authentication routes
│   │   └── user.routes.js # User routes
│   ├── .env               # Environment variables
│   ├── index.js           # Main server file
│   └── package.json       # Dependencies
```

### 2. Database Configuration

#### MongoDB Connection (`config/db.js`)
```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.dbUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);  // Exit process with failure
  }
};

export default connectDB;
```

**Key Concepts:**
- **Mongoose**: ODM (Object Document Mapper) for MongoDB
- **Async/Await**: Handles asynchronous database connection
- **Error Handling**: Gracefully exits if connection fails
- **Environment Variables**: Database URL stored securely in `.env`

### 3. User Model Schema

#### User Model (`models/user.model.js`)
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },
  followers: [],
  following: [],
  posts: [],
  reels: [],
  story: [],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
```

**Schema Features:**
- **Required Fields**: name, userName, email, password
- **Unique Constraints**: userName and email must be unique
- **Default Values**: profilePic and bio have empty string defaults
- **Arrays**: For storing relationships and content
- **Timestamps**: Automatically adds `createdAt` and `updatedAt`

### 4. JWT Token Generation

#### Token Configuration (`config/token.js`)
```javascript
import jwt from "jsonwebtoken";

const genToken = async (id) => {
  try {
    const token = jwt.sign(
      { id },                    // Payload
      process.env.JWT_SECRET,    // Secret key
      { expiresIn: "30d" }      // Token expiry
    );
    return token;
  } catch (error) {
    throw new Error("Error in generating token");
  }
};

export default genToken;
```

**JWT Concepts:**
- **Payload**: User ID encrypted in token
- **Secret Key**: Private key for signing tokens
- **Expiration**: Token valid for 30 days
- **Security**: Ensures user authentication persists

### 5. Authentication Controllers

#### Sign Up Controller (`controllers/auth.controllers.js`)
```javascript
export const signUp = async (req, res) => {
  const { name, userName, email, password } = req.body;
  
  try {
    // 1. Validate all fields
    if (!name || !userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // 2. Check email uniqueness
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // 3. Check username uniqueness
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already in use" });
    }
    
    // 4. Validate password length
    if (password.length <= 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }
    
    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);
    
    // 6. Create user
    const newUser = await User.create({ 
      name, 
      userName, 
      email, 
      password: hasedPassword 
    });
    
    // 7. Generate token and set cookie
    const token = await genToken(newUser._id);
    res.cookie('token', token, {
      httpOnly: true,    // Prevents JavaScript access
      sameSite: true,    // CSRF protection
      maxAge: 30*24*60*60*1000  // 30 days in milliseconds
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
```

**Security Implementation:**
1. **Input Validation**: Checks for empty fields
2. **Duplicate Prevention**: Ensures unique email/username
3. **Password Security**: 
   - Minimum length requirement
   - Bcrypt salt rounds (10) for security
   - Password hashing before storage
4. **HTTP-Only Cookies**: Prevents XSS attacks
5. **SameSite Cookie**: Prevents CSRF attacks

#### Sign In Controller
```javascript
export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    
    // Validate input
    if (!userName || !password) {
      return res.status(400).json({ message: "All fields Required" });
    }
    
    // Find user
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Password Incorrect" });
    }
    
    // Generate token and set cookie
    const token = await genToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 30*24*60*60*1000
    });
    
    res.status(200).json({ message: "User Logged in" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
```

### 6. Authentication Middleware

#### Auth Middleware (`middlewares/isAuth.js`)
```javascript
import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(404).json({ message: 'Token not found' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Attach user ID to request
    next();  // Continue to next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: 'Token is not Valid' });
  }
};

export default isAuth;
```

**Middleware Flow:**
1. Extracts token from cookies
2. Verifies token validity
3. Decodes user ID from token
4. Attaches user ID to request object
5. Passes control to next handler

### 7. Server Configuration

#### Main Server File (`index.js`)
```javascript
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());         // Parse JSON bodies
app.use(cookieParser());         // Parse cookies
app.use(cors({
  origin: 'http://localhost:5174',  // Frontend URL
  credentials: true                 // Allow cookies
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

**Middleware Stack:**
1. **express.json()**: Parses incoming JSON requests
2. **cookieParser()**: Enables cookie handling
3. **CORS**: Allows cross-origin requests with credentials

---

## Part 2: Frontend Development

### 1. Frontend Structure

```
social/
├── client/
│   ├── src/
│   │   ├── apiCalls/
│   │   │   ├── authCalls.js    # API functions
│   │   │   └── config.js       # API configuration
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Landing page
│   │   │   ├── SignUp.jsx      # Registration page
│   │   │   ├── SignIn.jsx      # Login page
│   │   │   ├── Home.jsx        # Main feed
│   │   │   └── ForgotPassword.jsx
│   │   ├── components/
│   │   │   └── NavBar.jsx      # Navigation component
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   └── vite.config.js          # Vite configuration
```

### 2. API Integration Layer

#### API Configuration (`apiCalls/config.js`)
```javascript
export const API_BASE_URL = "http://localhost:8000/";
```

#### API Calls (`apiCalls/authCalls.js`)
```javascript
import axios from "axios";
import { API_BASE_URL } from "./config";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Always send cookies
});

// Sign Up API call
export const signUp = async (userData) => {
  try {
    const response = await api.post("/api/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

// Sign In API call
export const signIn = async (userData) => {
  try {
    const response = await api.post("/api/auth/signin", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
```

**Key Features:**
- **Axios Instance**: Centralized API configuration
- **Credentials**: Automatically includes cookies
- **Error Handling**: Properly throws server errors

### 3. Sign Up Component

#### Sign Up Page (`pages/SignUp.jsx`)
```javascript
function SignUp() {
  // State management for form fields
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async() => {
    // Validation
    if(!name || !userName || !email || !password){
      alert("Please fill all the fields");
      return;
    }

    const user = { name, userName, email, password };

    try {
      const response = await signUp(user);
      console.log("Sign Up Successful", response);
      navigate("/home");  // Redirect to home
      
      // Clear form
      setName("");
      setUserName("");
      setEmail("");
      setPassword("");
    } catch(error) {
      console.error("Error during sign up", error);
      alert("Sign Up Failed. Please try again.");
    }
  }

  return (
    // UI Components with Tailwind CSS
    // ... (see full component for UI details)
  );
}
```

**React Concepts:**
1. **useState Hook**: Managing form state
2. **useNavigate Hook**: Programmatic navigation
3. **Async Event Handlers**: Handling API calls
4. **Controlled Components**: Form inputs bound to state
5. **Error Handling**: User-friendly error messages

### 4. Sign In Component

```javascript
function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async() => {
    if(!userName || !password){
      alert("Please fill all the fields");
      return;
    }

    const user = { userName, password };

    try {
      const response = await signIn(user);
      console.log("Sign In Successful", response);
      navigate("/home");
      
      // Clear form
      setUserName("");
      setPassword("");
    } catch(error) {
      console.error("Error during sign in", error);
      alert("Sign In Failed. Please try again.");
    }
  }

  return (
    // UI with gradient background and form
  );
}
```

### 5. Routing Configuration

#### App Component (`App.jsx`)
```javascript
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
```

### 6. Styling with Tailwind CSS

#### Tailwind Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

#### Global Styles (`index.css`)
```css
@import "tailwindcss";
```

### 7. Design Features

#### Gradient Backgrounds
The application uses complex gradient backgrounds for visual appeal:
```css
bg-[radial-gradient(1200px_800px_at_10%_-10%,#f58529_0%,transparent_35%),
    radial-gradient(1200px_800px_at_110%_0%,#dd2a7b_0%,transparent_40%),
    radial-gradient(900px_700px_at_50%_110%,#8134af_0%,transparent_45%),
    linear-gradient(180deg,#515bd4,#8134af)]
```

This creates an Instagram-like gradient effect combining:
- Orange (#f58529)
- Pink (#dd2a7b)
- Purple (#8134af)
- Blue (#515bd4)

---

## Security Best Practices Implemented

### Backend Security
1. **Password Hashing**: Using bcrypt with salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **HTTP-Only Cookies**: Prevents XSS attacks
4. **SameSite Cookies**: CSRF protection
5. **Input Validation**: Server-side validation
6. **Unique Constraints**: Database-level uniqueness
7. **Environment Variables**: Sensitive data protection

### Frontend Security
1. **Controlled Components**: Prevents injection attacks
2. **HTTPS in Production**: Secure data transmission
3. **Credential Management**: Cookies handled by browser
4. **Error Handling**: No sensitive data in errors

---

## Key Learning Points

### 1. Full-Stack Integration
- **API Design**: RESTful endpoints with proper HTTP methods
- **CORS Configuration**: Enabling cross-origin requests
- **Cookie-based Authentication**: Secure session management

### 2. React Best Practices
- **Component Organization**: Logical file structure
- **State Management**: Using hooks effectively
- **Routing**: Client-side navigation with React Router
- **API Integration**: Centralized API calls

### 3. MongoDB & Mongoose
- **Schema Design**: Structured data modeling
- **Validation**: Built-in and custom validators
- **Indexes**: Unique constraints for performance

### 4. Express.js Patterns
- **Middleware Chain**: Request processing pipeline
- **Error Handling**: Consistent error responses
- **Route Organization**: Modular route files

### 5. Modern UI/UX
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Gradient Effects**: Modern visual aesthetics
- **Form UX**: Clear labels and error messages

---

## Testing the Application

### 1. Backend Testing
```bash
# Start the server
npm run dev

# Test endpoints using Postman or curl
# Sign Up: POST http://localhost:8000/api/auth/signup
# Sign In: POST http://localhost:8000/api/auth/signin
```

### 2. Frontend Testing
```bash
# Start the development server
npm run dev

# Access at http://localhost:5174
```

### 3. Test Scenarios
1. **Sign Up Flow**:
   - Valid registration
   - Duplicate email/username
   - Short password
   - Missing fields

2. **Sign In Flow**:
   - Valid credentials
   - Invalid username
   - Wrong password
   - Missing fields

---

## Common Issues & Solutions

### 1. CORS Errors
**Problem**: Frontend can't communicate with backend
**Solution**: Ensure CORS middleware includes credentials and correct origin

### 2. Cookie Not Setting
**Problem**: Token not persisting
**Solution**: Check sameSite and httpOnly settings, ensure withCredentials in axios

### 3. MongoDB Connection
**Problem**: Database connection fails
**Solution**: Verify connection string and network access in MongoDB Atlas

### 4. JWT Errors
**Problem**: Token verification fails
**Solution**: Ensure JWT_SECRET matches and token hasn't expired

---

## Next Steps

1. **User Profile Management**: Edit profile, upload avatar
2. **Post Creation**: Create, edit, delete posts
3. **Social Features**: Follow/unfollow, likes, comments
4. **Real-time Updates**: WebSocket integration
5. **File Upload**: Image/video handling
6. **Search Functionality**: User and content search
7. **Notifications**: Real-time notifications
8. **Security Enhancements**: Rate limiting, input sanitization

---

This comprehensive guide covers all the concepts and implementations from the September 8th session.