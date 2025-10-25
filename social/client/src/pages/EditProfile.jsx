import { useState , useRef } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../apiCalls/authCalls";
import { setProfileData, setUserData } from "../redux/userSlice";


function EditProfile() {

   const { profileData } = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState("");
  const [serverProfileImage, setSeverProfileImage] = useState(null);
  const [userName, setUserName] = useState(profileData.userName);
  const [name, setName] = useState(profileData.name);
  const [bio, setBio] = useState(profileData.bio);
  const imageInput = useRef()

  console.log(imageInput)
  const dispatch = useDispatch()

   function handleImage(e){
      const file = e.target.files[0]

      const imageUrl = URL.createObjectURL(file)
      console.log(imageUrl)
      setProfileImage(imageUrl)
      setSeverProfileImage(file)

   }

   async function handleEditProfile(){
    try {
      const formData = new FormData()
      formData.append('name' ,name )
      formData.append('userName' , userName)
      formData.append('bio' , bio)
      if(serverProfileImage){
        formData.append('profileImage' , serverProfileImage)
      }

     const result =  await editProfile(formData)
     console.log(result)
     dispatch(setUserData(result))
     dispatch(setProfileData(result))
     console.log("data Saved in Redux")
      

    } catch (error) {
      console.log(`Cannot update Profile ${error}`)
    }
   }

  return (
    <div
      className="
        w-full min-h-screen 
        bg-[radial-gradient(1200px_800px_at_10%_-10%,#f58529_0%,transparent_35%),radial-gradient(1200px_800px_at_110%_0%,#dd2a7b_0%,transparent_40%),radial-gradient(900px_700px_at_50%_110%,#8134af_0%,transparent_45%),linear-gradient(180deg,#515bd4,#8134af)]
        flex items-center justify-center
        px-4
      "
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <MdOutlineKeyboardBackspace className="text-gray-700 cursor-pointer w-7 h-7" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        </div>

        {/* {message && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {message}
          </div>
        )} */}
        {/* {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )} */}

        {/* Profile Image */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden border-4 border-gray-200 shadow cursor-pointer group"
           onClick={()=>imageInput.current.click()}
          >
            <input type="file" accept="image/*" hidden ref={imageInput} onChange={handleImage} />
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition">
              Change
            </div>
          </div>
          <button className="text-blue-600 text-sm font-semibold hover:underline">
            Change Profile Picture
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[50px] bg-gray-100 border border-gray-300 rounded-lg px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Enter Your Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full h-[50px] bg-gray-100 border border-gray-300 rounded-lg px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full h-[50px] bg-gray-100 border border-gray-300 rounded-lg px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Save Button */}
        <button onClick={handleEditProfile} className="w-full h-[50px] bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition">
          Save Profile
        </button>
      </div>
    </div>
  );
}

export default EditProfile;