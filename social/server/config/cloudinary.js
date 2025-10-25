import { v2 as cloudinary } from "cloudinary";

const uploadFile = async (file) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(file, {
      resource_type:"auto"
    });
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};

export default uploadFile;