import React from "react";
import { Link } from "react-router-dom";
import logo1 from "../assets/socialLogo.png";
import logo2 from "../assets/logo2.png";

function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-[radial-gradient(1200px_800px_at_10%_-10%,#f58529_0%,transparent_35%),radial-gradient(1200px_800px_at_110%_0%,#dd2a7b_0%,transparent_40%),radial-gradient(900px_700px_at_50%_110%,#8134af_0%,transparent_45%),linear-gradient(180deg,#515bd4,#8134af)] flex flex-col">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center px-6 py-4 text-white font-semibold text-lg">
        <div className="flex items-center gap-2">
          <img src={logo1} alt="logo" className="w-[50px]" />
          <span className="tracking-wide text-xl">Scaler Gram</span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/signin"
            className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-[#0095f6] text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row flex-1 justify-center items-center gap-10 px-6 lg:px-20">
        {/* Left side */}
        <div className="text-white flex flex-col gap-6 max-w-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Connect. Share. Scale 🚀
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Welcome to <span className="font-bold">Scaler Gram</span> – the
            coolest place to share your journey, connect with people, and scale
            your network to the next level.
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-[#0095f6] text-white text-lg font-semibold rounded-xl shadow-md hover:opacity-90 transition active:scale-[.98]"
            >
              Get Started
            </Link>
            <Link
              to="/signin"
              className="px-6 py-3 bg-white text-gray-900 text-lg font-semibold rounded-xl shadow-md hover:opacity-90 transition active:scale-[.98]"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right side with image/logo */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-[300px] h-[300px] bg-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
          <img
            src={logo2}
            alt="App Logo"
            className="relative w-[350px] md:w-[400px] drop-shadow-2xl animate-bounce-slow"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center text-white py-4 text-sm opacity-80">
        © {new Date().getFullYear()} Scaler Gram — Scaling Connections 🌐
      </div>
    </div>
  );
}

export default LandingPage;