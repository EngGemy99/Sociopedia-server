import Post from "../../../models/Post.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import cloudinary from "../../utils/cloudinary.js";

/* CREATE */
export const createPost = catchError(async (req, res, next) => {
  //! first way to handle if user did not send image or send another file type
  if (req.file === undefined) {
    const { description } = req.body;
    const newPost = new Post({
      user: req.user._id,
      description,
      picturePost: "",
      likes: {},
      comments: [],
    });
    await newPost.save();
    await newPost.populate("user");
    res.status(201).json({
      message: "added successfully",
      newPost,
    });
  }
  let { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "Sociopedia/posts" }
  );
  const { description } = req.body;
  const newPost = new Post({
    user: req.user._id,
    description,
    picturePost: secure_url,
    likes: {},
    comments: [],
  });
  await newPost.save();
  await newPost.populate("user");

  res.status(201).json({
    message: "added successfully",
    newPost,
  });
});

/* READ */
export const getFeedPosts = catchError(async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({
    message: "All Posts",
    posts,
  });
});

export const getUserPosts = catchError(async (req, res, next) => {
  const { userId } = req.params;
  const posts = await Post.find({ user: userId });
  res.status(200).json({
    message: "All Posts",
    posts,
  });
});

/* UPDATE */
export const likePost = catchError(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const isLiked = post.likes.get(req.user._id);
  if (isLiked) {
    post.likes.delete(req.user._id);
  } else {
    post.likes.set(req.user._id, true);
  }
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likes: post.likes },
    { new: true }
  ).populate("user");

  res.status(200).json(updatedPost);
});

/* delete */
export const deletePost = catchError(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOneAndDelete({ _id: id, user: req.user._id });
  console.log(post);
  if (!post) return next(ErrorMessage(404, "not found post"));
  res.status(200).json({
    message: "Delete Successfully",
  });
});

//? create  comment
export const createComment = catchError(async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const { _id } = req.user;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: { user: _id, comment } } },
    { new: true }
  ).populate("comments.user");

  if (!updatedPost) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(201).json(updatedPost);
});
//? delete  comment
export const deleteComment = catchError(async (req, res) => {
  const { postId } = req.params;
  const { commentId } = req.params;

  const user = req.user;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $pull: { comments: { _id: commentId, user: user._id } },
    },
    { new: true }
  ).populate("comments.user");

  res.status(200).json(updatedPost);
});
