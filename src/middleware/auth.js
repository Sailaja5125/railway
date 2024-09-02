import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/errorhandling.js";
import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.js";
// verify the JWT token
export const verifyJWT = asynchandler(async(req ,_,next)=>{
try {

    const token = req.header("Authorization")
    console.log(token)
    if(!token){
        throw new ApiError(401 ,"Unauthorized request")
    }    
      const decoded = jwt.verify(token , process.env.REFRESH_TOKEN)
      const user = await UserModel.findById(decoded?._id).select("-password")
    
      if(!user){
        throw new ApiError(401 ,"Invalid Access Token")
      }
      req.user = user;
      next()

      
} catch (error) {
    throw new ApiError(401 , error?.message||"invalid access");
}
})