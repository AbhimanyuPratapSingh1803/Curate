import { ApiError } from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../Models/user.model.js";

// this middleware extracts current user from cookies (via accessToken)
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header
        ("Authorization")?.replace("Bearer ", "");
        
        if(!token){
            // throw new ApiError(401, "Unauthorized request.");
            return res.status(401).json({
                success: false,
                message: `Unauthorized access`,
            })
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let user = await User.findById(decodedToken._id).select("-password -refreshToken");
    
        if(!user){
            // throw new ApiError(401, "Invalid Access Token");
            return res.status(400).json({
                success: false,
                message: "Invalid Access Token"
            })
        }
    
        req.user = user;
        next()
    } catch (error) {
        // throw new ApiError(401, error?.message || "Invalid Access Token");
        return res.status(400).json({
            success: false,
            message: error?.message || "Invalid Access Token"
        })
    }
})