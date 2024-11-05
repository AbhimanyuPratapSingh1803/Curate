import { asyncHandler } from "../Utils/AsyncHandler.js";
import {ApiError} from "../Utils/ApiError.js"
import { User } from "../Models/user.model.js"
import {uploadOnCloudinary} from "../Utils/cloudinary.js"
import { ApiResponse } from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const createAccessAndRefreshTokens = async (userId) => {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave : false})

    return {accessToken, refreshToken};
}

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, password} = req.body;

    if(
        [fullName, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All the fields are required.")
    }

    const existedUser = await User.findOne({email})

    if(existedUser){
        // throw new ApiError(409, "User with this email already exists.")
        return res.status(400).json({
            success: false,
            message: "User Already Exsist"
        })
    }

    const user = await User.create({
        fullName,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        // throw new ApiError(500, "Something went wrong while registering user.");
        return res.status(400).json({
            success: false,
            message: "Something went wrong while registering user."
        })
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    // Ensuring either the username or email is entered by the user
    if(!email){
        throw new ApiError(400, "Email is required.");
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(401, "User doesn't exists.");
    }

    // Mathching the password entered by the user
    const isMatch = password === user.password;

    if(!isMatch){
        throw new ApiError(401, "Invalid user credentials.");
    }

    // created access and refresh token
    const {accessToken, refreshToken} = await createAccessAndRefreshTokens(user._id);
    const loggedInuser = await User.findOne(user._id);

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : "None",
    }

    // Send the access, refresh token and loggedinuser
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : {loggedInuser, accessToken, refreshToken},
            },
            "User logged in Successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    // for logging out the user we need the current loggedin user
    // so we made a middleware which axtracts the current user from the cookies
    // and then delete the cookies
    // and remove refresh token from the user's database
    await User.findByIdAndUpdate(
        // .user._id obtained from middleware
        // removing refresh token
        req.user._id,
        {
            $unset : {refreshtoken : 1}
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true,
    }

    // removing cookies
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged Out Successfully")
    )
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "User Fetched Successfully"
        )
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        res.status(400).json({
            success : false,
            message : "Unauthorized access"
        });
    };

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        if(!decodedToken){
            res.status(400).json({
                success : false,
                message : "Invalid Refresh Token"
            });
        }
    
        const user = await User.findById(decodedToken._id);
        if(!user){
            res.status(400).json({
                success : false,
                message : "Invalid Refresh Token"
            });
        }
        
        if(incomingRefreshToken !== user?.refreshToken){
            res.status(400).json({
                success : false,
                message : "Refresh token is expired or used"
            });
        }
    
        const {accessToken, newRefreshToken} = await createAccessAndRefreshTokens(user._id)
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken : newRefreshToken
                },
                "Access token refreshed"
            )
        )
    } catch (error) {
        console.error(error)
    }
})

export {registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken};