// src/components/LeftHomeDesign.jsx
import React from "react";
import logo from "../assets/socialLogo.png";
import {useSelector} from 'react-redux'
import SuggestedUsers from "./SuggestedUsers";


function LeftHome() {

 const {userData} = useSelector(state => state.user)
 const {suggestedUsers} = useSelector(state => state.user)
 console.log(suggestedUsers)
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
      {/* Header */}
      <div className="w-full h-[80px] flex items-center justify-between px-6 border-b border-neutral-200">
        <img src={logo} alt="Logo" className="w-[90px]" />
        <div className="relative">
          <div className="w-[26px] h-[26px] bg-neutral-200 rounded-full"></div>
          <div className="w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]"></div>
        </div>
      </div>

      {/* Profile section */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden border border-neutral-300">
            <img src={userData?.profileImage}  alt="profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-semibold text-sm text-neutral-900">{userData.userName}</div>
            <div className="text-xs text-neutral-500">{userData.name}</div>
          </div>
        </div>
        <div className="text-[#0095F6] text-sm font-semibold cursor-pointer hover:underline">
          Log Out
        </div>
      </div>

      {/* Suggested Users */}
      <div className="flex flex-col gap-4 px-6 py-5">
        <h1 className="text-sm font-semibold text-neutral-800">
          Suggested Users
        </h1>
        {suggestedUsers?.slice(0 ,5).map((user)=>{
          return <SuggestedUsers user={user}/>
        })}
        
      </div>
    </div>
  );
}

export default LeftHome;
