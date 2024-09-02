// User model schema 
import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // generate login tokens used to compare the password 
import bcrypt from "bcrypt"; // hashing the password
const UserSchema = new mongoose.Schema({
   username:{
    type: String,
    required :true,
    index :true, // to enable the searching
    trim :true,
    unique:true
   },
   email:{
    type: String,
    required :true,
    unique:true
   },
   password:{
    type: String,
    required :true
   },
   aadhar:{
    type: String,
    required :true
   },
},{timestamps:true})
// before saving the model in mongodb atlas 
UserSchema.pre("save",async function (next){  // password is hashed
    if(!this.isModified("password")){
     return next(); // next process is continued 
    }
    this.password =await bcrypt.hash(this.password ,10)
    next()
})
// compare the password is correct or not
UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

UserSchema.methods.generateToken=function(){
    return jwt.sign({_id:this._id},
        process.env.ACCESS_TOKEN,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
    })
}
UserSchema.methods.refreshToken = function(){
    return jwt.sign({_id:this._id
    } , process.env.REFRESH_TOKEN,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
    })
}

export const UserModel = mongoose.model("User",UserSchema)