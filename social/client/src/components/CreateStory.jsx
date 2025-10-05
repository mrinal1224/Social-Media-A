import React, { useState, useRef } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";

import { useDispatch } from "react-redux";
import { addStory } from "../redux/storySlice";
import { useNavigate } from "react-router-dom";
import { createStory } from "../../apiCalls/authCalls";


function CreateStory() {
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [backendMedia, setBackendMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const mediaInput = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.includes("image")) {
      setMediaType("image");
    } else if (file.type.includes("video")) {
      setMediaType("video");
    } else {
      setMessage("Please select an image or video file");
      return;
    }

    const mediaUrl = URL.createObjectURL(file);
    setFrontendMedia(mediaUrl);
    setBackendMedia(file);
  };

  const handleCreateStory = async () => {
    if (!backendMedia) {
      setMessage("Please select a media file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("mediaUrl", backendMedia);

      const result = await createStory(formData);
      dispatch(addStory(result));
      
      setMessage("Story created successfully! ✅");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create story ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(1200px_800px_at_10%_-10%,#f58529_0%,transparent_35%),radial-gradient(1200px_800px_at_110%_0%,#dd2a7b_0%,transparent_40%),radial-gradient(900px_700px_at_50%_110%,#8134af_0%,transparent_45%),linear-gradient(180deg,#515bd4,#8134af)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <MdOutlineKeyboardBackspace
            className="text-gray-700 cursor-pointer w-7 h-7"
            onClick={() => navigate("/home")}
          />
          <h1 className="text-2xl font-bold text-gray-900">Create Story</h1>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Upload Area */}
        {!frontendMedia ? (
          <div
            className="w-full h-[400px] bg-neutral-50 border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-4 rounded-xl cursor-pointer hover:bg-neutral-100 transition"
            onClick={() => mediaInput.current.click()}
          >
            <input
              type="file"
              accept="image/*,video/*"
              hidden
              ref={mediaInput}
              onChange={handleMedia}
            />
            <FiPlusSquare className="text-neutral-500 w-12 h-12" />
            <p className="text-neutral-600 font-medium">Upload Image or Video</p>
            <p className="text-neutral-400 text-sm">Your story will expire in 24 hours</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-4">
            {/* Preview */}
            <div className="w-full h-[400px] bg-black rounded-xl overflow-hidden">
              {mediaType === "image" ? (
                <img
                  src={frontendMedia}
                  alt="Story preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={frontendMedia}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setFrontendMedia(null);
                  setBackendMedia(null);
                  setMediaType("");
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Change
              </button>
              <button
                onClick={handleCreateStory}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post Story"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateStory;