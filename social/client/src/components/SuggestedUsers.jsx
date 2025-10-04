import React from "react";

function SuggestedUsers({user}) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-[50px] h-[50px] rounded-full bg-neutral-200">
            <img src={user.profileImage}/>
        </div>
        <div>
          <p className="font-medium text-sm text-neutral-800"></p>
          <p className="text-xs text-neutral-500">{user.userName}</p>
        </div>
      </div>
      <button className="text-[#0095F6] text-xs font-semibold hover:underline">
        Follow
      </button>
    </div>
  );
}

export default SuggestedUsers;
