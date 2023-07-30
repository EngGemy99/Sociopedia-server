import mongoose from "mongoose";

//one individual post has all these traits
const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: String,
    picturePost: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "User",
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

postSchema.pre("find", function () {
  this.populate("user", "firstName lastName email picture _id");
  this.populate("comments.user", "firstName lastName email picture _id");
});
const Post = mongoose.model("Post", postSchema);

export default Post;
