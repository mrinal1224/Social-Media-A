import React from "react";

function Reel({ reel }) {
  return (
    <div className="w-full bg-white border border-neutral-200 rounded-xl p-4 mb-6 shadow-sm">
      {/* Reels have their own component so reel-specific interactions can
          be added later without making the normal Post component complex. */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-[40px] h-[40px] rounded-full bg-neutral-300 overflow-hidden">
          <img
            src={reel.author?.profileImage}
            alt={reel.author?.userName || "profile"}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="font-semibold text-sm">
            {reel.author?.userName}
          </p>
          <p className="text-xs text-neutral-500">
            {new Date(reel.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="w-full min-h-[500px] bg-black rounded-lg overflow-hidden">
        <video
          src={reel.mediaUrl}
          controls
          playsInline
          className="w-full h-[500px] object-cover"
        />
      </div>

      {reel.caption && (
        <p className="text-sm text-neutral-700 mt-3">
          <span className="font-semibold">{reel.author?.userName}</span>{" "}
          {reel.caption}
        </p>
      )}
    </div>
  );
}

export default Reel;
