import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    email : {
        type : String,
        trim : true,
        required : true,
        unique : true,
    },
    fullName : {
        type : String,
        trim : true,
        required : true,
        index : true,
    },
    avatar : {
        type : String, //Url
    },
    password : {
        type : String,
        required : [true, 'Password is Required'],
    },
    refreshToken : {
        type : String,
    },
    bookmarks : [{
        type : Schema.Types.ObjectId,
        ref : "Blog",
    }],
},
{
    timestamps : true,
});

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            userName : this.userName,
            fullName : this.fullName,
        },
            process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id : this._id,
        },
            process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema);