import mongoose, {Schema} from "mongoose";

const blogSchema = new Schema({
    coverImage : {
        type : String,
    },
    title : {
        type : String,
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    content : {
        type : JSON,
        trim : true,
    },
    subTitle : {
        type : String,
        trim : true
    },
    likes : {
        type : Number,
        default : 0,
    },
    comments : {
        type : Schema.Types.ObjectId,
        ref : "Comment",
    },
    status : {
        type : String,
        enum : ["draft", "published"],
    }

}, {timestamps : true});

export const Blog = mongoose.model("Blog", blogSchema);