// src/pages/Upload.js
import React, { useState, useRef } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import logo2 from "../assets/logo2.png";
import { createPost } from "../../apiCalls/authCalls";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";

function Upload() {
  const {postData} =   useSelector(state=>state.post)
  const [uploadType, setUploadType] = useState("post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [backendMedia, setBackendMedia] = useState(null);
  const [loading] = useState(false);

  const mediaInput = useRef();
  const dispatch = useDispatch()


  const handleMedia = (e) => {
    const file = e.target.files[0];
    const mediaURL = URL.createObjectURL(file);

    if (file?.type.includes("image")) {
      setMediaType("image");
    } else if (file?.type.includes("video")) {
      setMediaType("video");
    } else {
      setMediaType(null);
      // Error Statement
    }
    setFrontendMedia(mediaURL);
    setBackendMedia(file);
  };

  console.log(mediaType);

  const uploadPost = async () => {
    let formData = new FormData();
     formData.append("mediaType", mediaType);
     formData.append("mediaUrl", backendMedia);
     formData.append("caption", caption);

  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }



    const result = await createPost(formData);
    dispatch(setPostData([...postData , result]))

  };

  const handleUpload = () => {
    uploadPost();
  };

  return (
    <div
      className="
        w-full min-h-screen 
        bg-[radial-gradient(1200px_800px_at_10%_-10%,#f58529_0%,transparent_35%),radial-gradient(1200px_800px_at_110%_0%,#dd2a7b_0%,transparent_40%),radial-gradient(900px_700px_at_50%_110%,#8134af_0%,transparent_45%),linear-gradient(180deg,#515bd4,#8134af)]
        flex items-center justify-center
      "
    >
      <div className="w-[95%] lg:max-w-[60%] h-[600px] rounded-2xl flex justify-center items-center overflow-hidden">
        {/* LEFT (form area) */}
        <div
          className="
            w-full lg:w-1/2 h-full 
            bg-white 
            flex flex-col items-center justify-start
            px-6 sm:px-10 
            pt-8
            gap-5
            shadow-[0_10px_40px_rgba(0,0,0,0.2)]
          "
        >
          {/* Header */}
          <div className="flex items-center gap-3 w-full">
            <MdOutlineKeyboardBackspace className="w-6 h-6 text-neutral-600 cursor-pointer" />
            <h2 className="text-lg font-semibold text-neutral-700">
              Upload Media
            </h2>
          </div>

          {/* Upload type switch */}
          <div className="w-[95%] h-[50px] bg-neutral-100 rounded-full flex justify-around items-center mt-2">
            {["post", "story", "reel"].map((type) => (
              <div
                key={type}
                onClick={() => setUploadType(type)}
                className={`
                  w-[28%] h-[80%] flex justify-center items-center text-sm font-medium rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    uploadType === type
                      ? "bg-[#0095F6] text-white shadow-md"
                      : "text-neutral-600 hover:bg-neutral-200"
                  }
                `}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            ))}
          </div>

          {/* Upload box */}
          {uploadType !== "post" ? (
            <div
              className="
                w-[95%] h-[220px] bg-neutral-50 border border-dashed border-neutral-300 
                flex flex-col items-center justify-center gap-3 
                mt-6 rounded-xl
              "
            >
              <FiPlusSquare className="text-neutral-400 w-8 h-8" />
              <p className="text-neutral-400 font-medium">
                {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}{" "}
                upload coming soon
              </p>
            </div>
          ) : !frontendMedia ? (
            <div
              className="
                w-[95%] h-[220px] bg-neutral-50 border border-dashed border-neutral-300 
                flex flex-col items-center justify-center gap-3 
                mt-6 rounded-xl cursor-pointer 
                hover:bg-neutral-100 transition
              "
              onClick={() => mediaInput.current.click()}
            >
              <input
                type="file"
                accept="image/*,video/*"
                hidden
                ref={mediaInput}
                onChange={handleMedia}
              />
              <FiPlusSquare className="text-neutral-500 w-8 h-8" />
              <p className="text-neutral-600 font-medium">Upload Post</p>
            </div>
          ) : (
            <div className="w-[95%] mt-6 flex flex-col items-center">
              {mediaType === "image" && (
                <img
                  src={frontendMedia}
                  alt=""
                  className="w-full max-h-[220px] object-cover rounded-xl"
                />
              )}
              {mediaType === "video" && (
                <video
                  src={frontendMedia}
                  controls
                  className="w-full max-h-[220px] rounded-xl"
                />
              )}

              <input
                type="text"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="
                  w-full mt-4 px-3 py-2 rounded-md border border-neutral-300 
                  bg-neutral-50 text-neutral-800 text-sm 
                  focus:outline-none focus:border-neutral-400
                "
              />
            </div>
          )}

          {/* Button */}
          {uploadType === "post" && frontendMedia && (
            <button
              onClick={handleUpload}
              className="
                w-[95%] h-[44px] mt-6 rounded-lg font-semibold 
                bg-[#0095F6] text-white 
                hover:bg-[#0086dd] active:scale-[0.99] transition
                shadow-[0_6px_16px_rgba(0,149,246,0.35)]
              "
            >
              {loading ? <ClipLoader size={24} color="white" /> : "Upload Post"}
            </button>
          )}
        </div>

        {/* RIGHT (branding / promo) */}
        <div
          className="
            md:w-1/2 h-full hidden lg:flex flex-col items-center justify-center 
            bg-white/10 backdrop-blur-[1px]
            text-white font-semibold
          "
        >
          <img
            src={logo2}
            alt=""
            className="w-[42%] drop-shadow-[0_10px_28px_rgba(0,0,0,0.25)]"
          />
          <p className="mt-4 text-white/95">Share your moments on ScalerGram</p>
        </div>
      </div>
    </div>
  );
}

export default Upload;