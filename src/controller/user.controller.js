import { asynchandler } from "../utils/asynchandler.js";
import { UserModel } from "../models/user.model.js";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/errorhandling.js";
import { ApiResponse } from "../utils/apiresponse.js";

const generateaccessAndrefreshtokens = async(id)=>{
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const access_token =  user.refreshToken();
    console.log(access_token)
    await user.save();
    return { access_token };
  } catch (err) {
    throw new ApiError(500, "Internal Server Error");
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { username, email, password ,aadhar} = req.body;

  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new ApiError(400, "invalid validation");
  }

  const user = await UserModel.findOne({
    $or: [{ email }, { username }],
  });
  if (user) {
    throw new ApiError(409, "User with email or username exists");
  }

  // create a object to
  const User = await UserModel.create({
    username,
    email,
    password,
    aadhar,
  });

  const createduser = await UserModel.findById(User._id).select(
    "-password"
  );

  if (!createduser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createduser, "User registered successfully"));
});

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  const user = await UserModel.findOne({email});
  if (!user) {
    throw new ApiError(409, "Invalid Credentials");
  }
  const valid_password = await user.isPasswordCorrect(password);
  if (!valid_password) {
    throw new ApiError(401, "Invalid Credentials");
  }

  
  const { access_token } = await generateaccessAndrefreshtokens(user._id);

  const loggedinUser = await UserModel.findById(user._id).select(
    "-password"
  ); 

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser,
          access_token,
        },
        "User logged in successfully"
      )
    );
});



const logoutUser = asynchandler(async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    // Handle potential errors
    return res.status(500).json(new ApiResponse(500, "Error logging out user"));
  }
});


const currentpasswordChange = asynchandler(async (req, res) => {
  const { aadhar , newpassword } = req.body;
  const user = await UserModel.findOne({aadhar});
  user.password = newpassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {user}, "Password changed successfully"));
});

const getCurrentUser = asynchandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});


export {
  registerUser,
  loginUser,
  logoutUser,
  currentpasswordChange,
  getCurrentUser,
};

// register
// get user details through frontend../
// validation --not empty../
// check if user already exist../
// check for images /avatar../
// upload on cloudinary../
// create user object -- create entry in mongo db../
// remove password and refresh token from response../
// check if user exist for user creation../
// return response to user..

// login
// email & password ../
// if password & email is equal to User in database ../
// true than generate access tokens and refresh tokens ../
// if false than throw error ../
// send these in cookies ../

// logout
// verify JWT of the user to logout the user.  // use middlewares ../
// just reset the refresh token // using findandupdate ../
// just clear the cookies ../
