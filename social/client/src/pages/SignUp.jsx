import React, { useState } from "react";
import logo1 from "../assets/socialLogo.png";
import logo2 from "../assets/logo2.png";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../../apiCalls/authCalls";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";

function SignUp() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignUp = async () => {
    try {
        
      const data = await signUpUser({ name, userName, email, password });
      console.log("Signup Success:", data);
      dispatch(setUserData(data))
      navigate('/home')

    } catch (error) {
      console.error("Signup Error:", error);

      // Optionally, show an error message to the user here
    }
  };

  return (
    <div>
      <div className="w-full min-h-screen        bg-[radial-gradient(1200px_800px_at_10%_-10%,#f58529_0%,transparent_35%),radial-gradient(1200px_800px_at_110%_0%,#dd2a7b_0%,transparent_40%),radial-gradient(900px_700px_at_50%_110%,#8134af_0%,transparent_45%),linear-gradient(180deg,#515bd4,#8134af)] flex flex-col justify-center items-center">
        <div className="w-full lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border border-gray-200 shadow-sm">
          <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-6 gap-5">
            <div className="flex gap-2 items-center text-[20px] font-semibold mt-8 text-gray-800">
              <span>Sign Up to </span>
              <img src={logo1} alt="" className="w-[70px]" />
            </div>

            <div className="relative flex items-center justify-start w-[90%] h-[44px] rounded-md mt-4 border border-gray-300 bg-white hover:border-gray-400 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition">
              <label
                htmlFor="name"
                className="absolute -top-2 left-4 px-1 bg-white text-xs text-gray-500"
              >
                Enter Your Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full h-full rounded-md px-4 outline-none border-0 text-sm text-gray-900 placeholder-gray-400 bg-transparent"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative flex items-center justify-start w-[90%] h-[44px] rounded-md border border-gray-300 bg-white hover:border-gray-400 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition">
              <label
                htmlFor="userName"
                className="absolute -top-2 left-4 px-1 bg-white text-xs text-gray-500"
              >
                Enter Username
              </label>
              <input
                type="text"
                id="userName"
                className="w-full h-full rounded-md px-4 outline-none border-0 text-sm text-gray-900 placeholder-gray-400 bg-transparent"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="relative flex items-center justify-start w-[90%] h-[44px] rounded-md border border-gray-300 bg-white hover:border-gray-400 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition">
              <label
                htmlFor="email"
                className="absolute -top-2 left-4 px-1 bg-white text-xs text-gray-500"
              >
                Enter Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full h-full rounded-md px-4 outline-none border-0 text-sm text-gray-900 placeholder-gray-400 bg-transparent"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative flex items-center justify-start w-[90%] h-[44px] rounded-md border border-gray-300 bg-white hover:border-gray-400 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition">
              <label
                htmlFor="password"
                className="absolute -top-2 left-4 px-1 bg-white text-xs text-gray-500"
              >
                Enter password
              </label>
              <input
                // type={showPassword ? "text" : "password"}
                id="password"
                className="w-full h-full rounded-md px-4 outline-none border-0 text-sm text-gray-900 placeholder-gray-400 bg-transparent"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleSignUp}
              className="w-[70%] h-[44px] bg-[#0095f6] text-white font-semibold rounded-lg mt-4 hover:opacity-90 active:scale-[.99] transition shadow-sm"
            >
              Sign Up
            </button>

            <p className="cursor-pointer text-gray-700 text-sm">
              Already Have An Account?{" "}
              <span className="border-b border-gray-800 pb-[2px] text-gray-900 hover:opacity-80">
                <Link to="/signin"> Sign In</Link>
              </span>
            </p>
          </div>

          <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex-col gap-2 text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl">
            <img src={logo2} alt="" className="w-[40%] drop-shadow-sm" />
            <p className="opacity-95">Scaler Gram - Scaling Connections</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;