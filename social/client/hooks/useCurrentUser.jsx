import React from "react";
import { useEffect } from "react";
import { getCurrentUser } from "../apiCalls/authCalls";
import { useDispatch } from "react-redux";
import { setUserData } from "../src/redux/userSlice";



function useCurrentUser() {
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchData() {
      const data = await getCurrentUser();
      console.log(data)
      dispatch(setUserData(data))
    }
    fetchData();
  }, []);
}

export default useCurrentUser;