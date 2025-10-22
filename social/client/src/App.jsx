import "./App.css";
import Landing from "./pages/Landing.jsx";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import useCurrentUser from "../hooks/useCurrentUser.jsx";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Upload from "./pages/Upload.jsx";
import useAllPosts from "../hooks/useAllPosts.jsx";
import getSuggestedUsers from "../hooks/getSuggestedUsers.jsx";
import CreateStory from "./components/CreateStory.jsx";



function App() {
  useCurrentUser()
  useAllPosts()
  getSuggestedUsers()
  // get userData using useSelector (redux)
  const {userData ,profileData} = useSelector(state=>state.user)

  return (
    <>
      <Routes>
        <Route path="/" element={!userData?<Landing />:<Navigate to='/home'/>} />
        <Route path="/signin" element={!userData?<SignIn />:<Navigate to='/home'/>} />
        <Route path="/signup" element={!userData?<SignUp />:<Navigate to='/home'/>} />
        <Route path="/home" element={userData?<Home />:<Navigate to='/signin'/>} />
        <Route path="/profile/:userName" element={<Profile />} />
        <Route path="/editprofile/" element={userData?<EditProfile/>:<Navigate to='/signin'/>} />
        <Route path="/upload" element={<Upload/>} />
        <Route path='/create-story' element={<CreateStory/>}/>
        
      </Routes>
    </>
  );
}

export default App;
