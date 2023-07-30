import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
  createComment,
  deleteComment,
} from "./postsController.js";
import { verifyToken } from "../../middleware/auth.js";
import { protectedRoutes } from "../../middleware/ProtectedRoutes.js";
import { fileUpload } from "../../utils/FileUpload.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/user_posts/:userId", protectedRoutes, getUserPosts);

// /* UPDATE */
router.patch("/:id/like", protectedRoutes, likePost);
router.patch("/:id/comment", protectedRoutes, likePost);
/* create */

router.post(
  "/add_post",
  fileUpload("picturePost"),
  protectedRoutes,
  createPost
);
//? Delete
router.delete("/:id/delete", protectedRoutes, deletePost);
export default router;

//? add new comment
router.post("/:postId/comment", protectedRoutes, createComment);

//? delete comment
router.delete("/:postId/comment/:commentId", protectedRoutes, deleteComment);
