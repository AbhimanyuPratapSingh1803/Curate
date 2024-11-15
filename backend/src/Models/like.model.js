import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    comment : {
        type : Schema.Types.ObjectId,
        ref : "Comment",
    },
    blog : {
        type : Schema.Types.ObjectId,
        ref : "Blog",
    },
}, {timestamps : true});

export const Like = mongoose.model("Like", likeSchema);