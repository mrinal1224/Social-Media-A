import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateStoryViewers, } from "../redux/storySlice";
import { IoClose } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { viewStory  } from "../../apiCalls/authCalls";

function StoryViewer({ storyGroup, onClose, currentUserId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const dispatch = useDispatch();

  const stories = storyGroup.stories || [];
  const currentStory = stories[currentIndex];
  const isOwnStory = storyGroup.author._id === currentUserId;

  useEffect(() => {
    if (!currentStory) return;

    // Mark story as viewed
    const markAsViewed = async () => {
      try {
        const updatedStory = await viewStory(currentStory._id);
        dispatch(updateStoryViewers(updatedStory));
      } catch (error) {
        console.error("Error viewing story:", error);
      }
    };

    markAsViewed();

    // Progress bar animation
    const duration = currentStory.mediaType === "video" ? 15000 : 5000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, currentStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

//   const handleDelete = async () => {
//     if (!window.confirm("Delete this story?")) return;

//     try {
//       await deleteStory(currentStory._id);
//       dispatch(removeStory(currentStory._id));
//       if (stories.length === 1) {
//         onClose();
//       } else {
//         if (currentIndex === stories.length - 1) {
//           setCurrentIndex(Math.max(0, currentIndex - 1));
//         }
//       }
//     } catch (error) {
//       console.error("Error deleting story:", error);
//     }
//   };

  const getTimeAgo = (date) => {
    const hours = Math.floor((Date.now() - new Date(date)) / 3600000);
    if (hours < 1) return "Just now";
    return `${hours}h ago`;
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-screen bg-black">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
          {stories.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all"
                style={{
                  width:
                    idx === currentIndex
                      ? `${progress}%`
                      : idx < currentIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-3">
            <img
              src={storyGroup.author.profileImage || "/default-avatar.png"}
              alt={storyGroup.author.userName}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <p className="text-white font-semibold text-sm">
                {storyGroup.author.userName}
              </p>
              <p className="text-white/70 text-xs">
                {getTimeAgo(currentStory.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOwnStory && (
              <>
                <button
                  onClick={() => setShowViewers(!showViewers)}
                  className="flex items-center gap-1 text-white"
                >
                  <AiFillEye className="w-5 h-5" />
                  <span className="text-sm">{currentStory.viewers?.length || 0}</span>
                </button>
                <FiTrash2
                  className="w-5 h-5 text-white cursor-pointer"
                />
              </>
            )}
            <IoClose
              className="w-6 h-6 text-white cursor-pointer"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Story Content */}
        <div
          className="w-full h-full flex items-center justify-center"
          onClick={(e) => {
            const clickX = e.clientX;
            const screenWidth = window.innerWidth;
            if (clickX < screenWidth / 2) {
              handlePrevious();
            } else {
              handleNext();
            }
          }}
        >
          {currentStory.mediaType === "image" ? (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={currentStory.mediaUrl}
              className="w-full h-full object-contain"
              autoPlay
              muted
            />
          )}
        </div>

        {/* Viewers Panel */}
        {showViewers && isOwnStory && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[50vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-3">
              Viewers ({currentStory.viewers?.length || 0})
            </h3>
            {currentStory.viewers && currentStory.viewers.length > 0 ? (
              <div className="space-y-3">
                {currentStory.viewers.map((viewer) => (
                  <div key={viewer._id} className="flex items-center gap-3">
                    <img
                      src={viewer.profileImage || "/default-avatar.png"}
                      alt={viewer.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <p className="font-medium">{viewer.userName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No views yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryViewer;