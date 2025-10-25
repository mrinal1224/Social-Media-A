// src/pages/Home.jsx
import React from "react";
import LeftHome from "../components/LeftHome";
import Feed from "../components/Feed";
import RightHome from "../components/RightHome";

function Home() {
  return (
    <div
      className="
       w-full min-h-screen
        bg-[radial-gradient(1200px_800px_at_10%_-10%,#f58529_0%,transparent_35%),radial-gradient(1200px_800px_at_110%_0%,#dd2a7b_0%,transparent_40%),radial-gradient(900px_700px_at_50%_110%,#8134af_0%,transparent_45%),linear-gradient(180deg,#515bd4,#8134af)]
        flex justify-center
        px-2 sm:px-4 lg:px-6
        py-6
        gap-1
        
      "
    >
      {/* LEFT HOME (hidden on mobile) */}
      <LeftHome/>

      {/* FEED */}
      <Feed/>


      <RightHome/>
    </div>
  );
}

export default Home;