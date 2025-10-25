// src/components/RightHomeDesign.jsx
import React from "react";
import Messages from "../pages/Messages";

function RightHome() {
  return (
    <div
      className="
        hidden lg:flex flex-col
        w-[40%] h-[90vh] 
        bg-white rounded-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        overflow-hidden
      "
    >
      <Messages/>
    </div>
  );
}

export default RightHome;
