import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
     // Configuration of cloudinary
        cloudinary.config({ 
        cloud_name: 'dglnpuq0z', 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

const imageupload = async(localfilepath)=>{
  try{
    const uploadResult = await cloudinary.uploader
       .upload(localfilepath,{
        resource_type:"auto"
       })
      //  console.log(uploadResult);
      fs.unlinkSync(localfilepath);
       return uploadResult; // sends a response    
  }catch(error){
   fs.unlinkSync(localfilepath);// remove the locally saved temporary file as the upload operation got failed
    console.log(error);
    return null;
       };
    
}

export {imageupload}