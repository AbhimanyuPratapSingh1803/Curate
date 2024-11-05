import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {upload} from "../Middlewares/multer.middleware.js"
import {uploadCoverImage, deleteImg, uploadBlogImage, publish, fetchAllBlogs, saveDraft, updateDraft, fetchDrafts, deleteBlog, fetchPublished, fetchBlog} from "../Controllers/blog.controller.js"

const router = Router();

router.route("/cover-img").post(upload.single("cover-img"), uploadCoverImage);

router.route("/delete-image").post(deleteImg);

router.route("/uploadImage").post(upload.single("image"), uploadBlogImage);

router.route("/publish").post(verifyJWT, publish);

router.route("/draft").post(verifyJWT, saveDraft);

router.route("/updateDraft").put(verifyJWT, updateDraft);

router.route("/getAllBlogs").get(fetchAllBlogs);

router.route(`/fetch-drafts`).post(verifyJWT, fetchDrafts);

router.route(`/fetch-published`).post(verifyJWT, fetchPublished);

router.route("/delete-blog").post(verifyJWT, deleteBlog);

router.route("/fetch-blog").post(verifyJWT, fetchBlog);

export default router;