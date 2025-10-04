import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setAllStories } from "../redux/storySlice";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import StoryViewer from "./StoryViewer";
import { getAllStories } from "../../apiCalls/authCalls";


function StoriesBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allStories } = useSelector((state) => state.story);
  const { userData } = useSelector((state) => state.user);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const result = await getAllStories();
      dispatch(setAllStories(result));
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const handleStoryClick = (storyGroup) => {
    console.log('clicked')
    setSelectedStoryGroup(storyGroup);
  };

  const closeStoryViewer = () => {
    setSelectedStoryGroup(null);
  };

  // Check if current user has stories
  const myStoryGroup = allStories.find(
    (group) => group.author._id === userData?._id
  );

  return (
    <>
      <div className="flex w-full overflow-x-auto gap-4 px-6 py-4 border-b border-neutral-200">
        {/* Your Story / Add Story */}
        <div
          className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
          onClick={() => navigate("/create-story")}
        >
          <div className="relative w-[60px] h-[60px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            {myStoryGroup ? (
              <img
                src={userData?.profileImage}
                alt="Your story"
                className="w-[56px] h-[56px] rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-[56px] h-[56px] rounded-full bg-neutral-300 flex items-center justify-center">
                <img
                  src={userData?.profileImage}
                  alt="Your story"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-[20px] h-[20px] bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <FiPlus className="text-white w-3 h-3" />
            </div>
          </div>
          <p className="text-xs text-neutral-600">Your Story</p>
        </div>

        {/* Other Users Stories */}
        {allStories
          .filter((group) => group.author._id !== userData?._id)
          .map((storyGroup) => (
            <div
              key={storyGroup.author._id}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
              onClick={() => handleStoryClick(storyGroup)}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px]">
                <img
                  src={
                    storyGroup.author.profileImage || "/default-avatar.png"
                  }
                  alt={storyGroup.author.userName}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <p className="text-xs text-neutral-600">
                {storyGroup.author.userName}
              </p>
            </div>
          ))}

        {/* Show my story group if exists */}
        {myStoryGroup && (
          <div
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
            onClick={() => handleStoryClick(myStoryGroup)}
          >
            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px]">
              <img
                src={userData?.profileImage || "/default-avatar.png"}
                alt="Your story"
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            <p className="text-xs text-neutral-600">Your Story</p>
          </div>
        )}
      </div>

      {/* Story Viewer */}
      {selectedStoryGroup && (
        <StoryViewer
          storyGroup={selectedStoryGroup}
          onClose={closeStoryViewer}
          currentUserId={userData?._id}
        />
      )}
    </>
  );
}

export default StoriesBar;