import mongoose from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picture: {
      type: String,
      default: "",
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 8);
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
