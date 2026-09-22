import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReels } from "../apiCalls/authCalls.js";
import { setReelData } from "../src/redux/reelSlice.js";

function useAllReels() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch reels only after authentication is available.
    // Re-fetching when userData changes keeps the feed in sync with the
    // currently logged-in user's following list.
    const fetchReels = async () => {
      try {
        const result = await getAllReels();
        dispatch(setReelData(result));
      } catch (error) {
        console.log(error);
      }
    };

    if (userData) {
      fetchReels();
    }
  }, [dispatch, userData]);
}

export default useAllReels;