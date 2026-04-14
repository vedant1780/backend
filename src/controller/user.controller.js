import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';
// const registerUser = asyncHandler(async (req, res) => {
//     res.status(200).json({
//         message:"Chai Aur Code"
//     });
// });

const registerUser = asyncHandler(async (req, res) => {
   //get user details from frontend
   //validation-not empty
   //check if user already exists:username,email
   //check for immages,check for avatar
   //upload them to cloudnary
   //create user object-create entry in db
   //remove password and refresh token field from response
   //check for user creatation
   //return res
   const{fullName,email,username,password}=req.body
   console.log("Email",email);
   if(
    [fullName,email,username,password].some((field)=>field?.trim()==="")
   ){
    throw new ApiError(400,"All fields are required")
   }
const exsistedUser=User.findOne({
    $or:[{username},{email}]
})
if(exsistedUser){
    throw new ApiError(409,"User with email or username already exists")
}
const avatarLocalPath=req.files?.avatar[0]?.path
const coverImageLocalPath=req.files?.coverImage[0]?.path
if(!avatarLocalPath)
{
    throw new ApiError(400,"Avatar File is Required")
}
const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)
if(!avatar)
{
    throw new ApiError(400,"Avatar File is Required")
}
const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url ||"",
    email,
    password,
    username:username.toLowerCase()
})
const CreatedUser=await User.findById(user._id).select(
    "-password -refreshToken "
)
if(!CreatedUser){
    throw new ApiError("Something went wrong while registering the user")

}
return res.status(201).json(
    new ApiResponse(200,CreatedUser,"User Registered Successfully")
)

    });
export { registerUser };