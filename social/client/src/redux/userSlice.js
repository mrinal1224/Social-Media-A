import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
      name : 'user',

      initialState:{
        userData : null,
        profileData:null,
      },


      reducers:{
        setUserData : (state , action)=>{
            state.userData= action.payload
        } ,

        setProfileData:(state , action)=>{
          state.profileData= action.payload
        },

        setSuggestedUsers:(state,action)=>{
        state.suggestedUsers=action.payload
       }



        // clearUserData : (state , action)=>{
        //     state.userData = null
        // }
      }
})

export const {setUserData , setProfileData , setSuggestedUsers} = userSlice.actions
export default userSlice.reducer