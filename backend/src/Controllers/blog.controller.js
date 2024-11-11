import { asyncHandler } from "../Utils/AsyncHandler.js";
import { Blog } from "../Models/blog.model.js"
import {uploadOnCloudinary, deleteImage} from "../Utils/cloudinary.js"
import { ApiResponse } from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { ObjectId } from 'mongodb';

// mongoose.set("debug", true);

const uploadCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        return res.status(400).json({
            success : false,
            message : "Cover Image file not found."
        })
    }
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage){
        return res.status(400).json({
            success : false,
            message : "Couldn't upload Cover Image on Cloudinary."
        })
    }

    return res.status(200).json({
        success : true,
        url : coverImage.url,
    })
});

const uploadBlogImage = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path;
    if(!imageLocalPath){
        return res.status(400).json({
            success : false,
            message : "Image file not found."
        })
    }
    
    const image = await uploadOnCloudinary(imageLocalPath);
    if(!image){
        return res.status(400).json({
            success : false,
            message : "Couldn't upload Image on Cloudinary."
        })
    }

    return res.status(200).json({
        success : true,
        url : image.url,
    })
});

const deleteImg = asyncHandler(async (req, res) => {
    const publicUrl = req.body;
    const response = await deleteImage(publicUrl);
    if(!response){
        res.status(400).json({
            success : false,
            message : `Error deleting file from Cloudinary ${response}`
        })
    }

    res.status(200).json({
        success : true,
        message : `File successfully deleted from Cloudinary : ${response}`
    });
});

const publish = asyncHandler(async (req, res) => {
    const {coverImage, title, subTitle, content} = req.body;
    if(!title || !content){
        res.status(400).json({
            success : false,
            message : "Title, Cover image and Content are required"
        });
    }

    console.log(req.user);
    const userId = req.user._id;
    const blog = await Blog.create({
        coverImage,
        title,
        subTitle,
        content,
        author : userId,
        status : "published",
    });

    const createdBlog = await Blog.findById(blog._id).populate("author", ["fullName"]);
    if(!createdBlog){
        res.status(400).json({
            success : false,
            message : `Error publishing the blog ${createdBlog}`
        })
    }

    if(createdBlog){
        res.status(200).json({
            success : true,
            message : `Published blog successfully`,
            data : createdBlog
        })
    }
});

const publishDraft = asyncHandler(async (req, res) => {
    const {coverImage, title, subTitle, content, blogId} = req.body;
    if(!title || !content){
        res.status(400).json({
            success : false,
            message : "Title, Cover image and Content are required"
        });
    }

    console.log(req.user);
    const userId = req.user._id;

    const findBlog = await Blog.findById(blogId);
    if(!findBlog){
        res.status(400).json({
            success : false,
            message : `Error error finding draft to publish ${findBlog}`
        })
    }
    const blog = await Blog.findByIdAndUpdate(blogId, {
        coverImage,
        title,
        subTitle,
        content,
        author : userId,
        status : "published",
    }, {new : true, upsert : false});

    if(!blog){
        res.status(400).json({
            success : false,
            message : `Error publishing the blog ${blog}`
        })
    }

    const createdBlog = await Blog.findById(blog._id).populate("author", ["fullName"]);
    if(!createdBlog){
        res.status(400).json({
            success : false,
            message : `Error publishing the draft ${createdBlog}`
        })
    }

    if(createdBlog){
        res.status(200).json({
            success : true,
            message : `Published draft successfully`,
            data : createdBlog
        })
    }
})

const saveDraft = asyncHandler(async (req, res) => {
    const {coverImage, title, subTitle, content} = req.body;
    if(!title || !content){
        res.status(400).json({
            success : false,
            message : "Title, Cover image and Content are required"
        });
    }

    console.log(req.user);
    const userId = req.user._id;
    const blog = await Blog.create({
        coverImage,
        title,
        subTitle,
        content,
        author : userId,
        status : "draft",
    });

    const createdBlog = await Blog.findById(blog._id).populate("author", ["fullName"]);
    if(!createdBlog){
        res.status(400).json({
            success : false,
            message : `Error publishing the blog ${createdBlog}`
        })
    }

    if(createdBlog){
        res.status(200).json({
            success : true,
            message : `Published blog successfully`,
            data : createdBlog
        })
    }
});

const updateDraft = asyncHandler(async (req, res) => {
    const {coverImage, title, subTitle, content, blogId} = req.body;
    if(!title || !content){
        res.status(400).json({
            success : false,
            message : "Title, Cover image and Content are required"
        });
    }

    console.log(req.user);
    const userId = req.user._id;

    const findBlog = await Blog.findById(blogId);
    if(!findBlog){
        res.status(400).json({
            success : false,
            message : `Error error finding draft to update ${findBlog}`
        })
    }

    const blog = await Blog.findByIdAndUpdate(blogId, {
        $set: {coverImage,
        title,
        subTitle,
        content,
        status : "draft",
        author : userId,}
    }, {new : true, upsert : false});

    const createdBlog = await Blog.findById(blog._id).populate("author", ["fullName"]);
    if(!createdBlog){
        res.status(400).json({
            success : false,
            message : `Error saving the draft ${createdBlog}`
        })
    }

    if(createdBlog){
        res.status(200).json({
            success : true,
            message : `Saved draft successfully`,
            data : createdBlog
        })
    }
});

const fetchAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({status : "published"}).populate("author", ["fullName"]);
    if(!blogs){
        res.status(400).json({
            message : "Error fetching blogs",
            success : false,
        })
    }

    res.status(200).json(
        new ApiResponse(
            200,
            blogs,
            `All the blogs fetched successfully`
        )
    )
});

const fetchDrafts = asyncHandler(async (req, res) => {
    const {id} = req.body;
    const blogs = await Blog.find({status : "draft", "author": (id)}).populate("author", ["fullName"]);
    if(!blogs){
        res.status(400).json({
            message : "Error getting drafts",
            success : false,
        })
    }

    res.status(200).json({
        success : true,
        data : blogs,
        message : `All the drafts fetched successfully, ${id}`
    })
});

const fetchPublished = asyncHandler(async (req, res) => {
    const {id} = req.body;
    const blogs = await Blog.find({status : "published", "author": (id)}).populate("author", ["fullName"]);
    if(!blogs){
        res.status(400).json({
            message : "Error getting published blogs",
            success : false,
        })
    }

    res.status(200).json({
        success : true,
        data : blogs,
        message : `All the published blogs fetched successfully, ${id}`
    })
});

const deleteBlog = asyncHandler(async (req, res) => {
    const {_id} = req.body;
    const blog = await Blog.findOneAndDelete({"_id" : _id});

    if(!blog){
        res.status(400).json({
            success : false,
            message : `Error deleting the blog`
        })
    }

    res.status(200).json({
        success : true,
        data : blog,
        message : "Blog deleted successfully." 
    })
});

const fetchBlog = asyncHandler(async (req, res) => {
    const {_id} = req.body;
    if(!_id){
        res.status(400).json({
            success : false,
            message : "Specified blog's Id not found!"
        });
    }

    const blog = await Blog.findById(_id).populate("author", "fullName");

    if(!blog){
        res.status(400).json({
            success : false,
            message : "Specified blog not found!"
        });
    }

    res.status(200).json({
        success : true,
        data : blog,
        message : "Fetched the blog successfully!"
    })
})

const searchBlogs = asyncHandler(async (req, res) => {
    const searchQuery = req.query.query || "";
    
    if(req.query.query === ""){
        res.status(400).json({
            success : false,
            message : "Search query is empty!"
        })
    }

    const blogs = await Blog.find({title : {$regex : searchQuery, $options : "i"}}).limit(5).populate("author", "fullName");
    if(!blogs){
        res.status(400).json({
            success : false,
            message : "Error fetching blogs"
        })
    }

    res.status(200).json({
        success : true,
        data : blogs,
        message : "All the blogs fetched successfully"
    })
})

export {uploadCoverImage, uploadBlogImage, deleteImg, publish, fetchAllBlogs, updateDraft, saveDraft, fetchDrafts, deleteBlog, fetchPublished, fetchBlog, searchBlogs, publishDraft}