import { Router } from "express";
import { loginUser, logoutUser, registerUser, getCurrentUser, refreshAccessToken, addBookmark, fetchBookmarks, isBookmarked, removeBookmark} from "../Controllers/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/verify-user").get(verifyJWT);

router.route("/refresh").post(verifyJWT, refreshAccessToken);

router.route("/add-bookmark").post(verifyJWT, addBookmark);

router.route("/removeBookmark").post(verifyJWT, removeBookmark);

router.route("/bookmarks").get(verifyJWT, fetchBookmarks);

router.route("/isBookmarked").post(verifyJWT, isBookmarked);

export default router;