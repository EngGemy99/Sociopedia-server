import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../models/User.js"; //mongoose model
import { catchError } from "../../utils/catchAsyncError.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import cloudinary from "../../utils/cloudinary.js";
export const register = catchError(async (request, response, next) => {
  //! first way to handle if user did not send image or send another file type
  if (request.file === undefined) {
    let error = new Error("upload Image Only 🙄");
    error.status = 400;
    return next(error);
  }
  //? Start to upload image in cloudinary
  let { public_id, secure_url } = await cloudinary.uploader.upload(
    request.file.path,
    { folder: "Sociopedia/users" }
  );
  const {
    firstName,
    lastName,
    email,
    password,
    friends,
    location,
    occupation,
  } = request.body;
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    friends,
    // get picture from multer
    picture: secure_url,
    location,
    occupation,
    viewedProfile: Math.floor(Math.random() * 10000),
    impressions: Math.floor(Math.random() * 10000),
  });
  const savedUser = await newUser.save();
  response.status(201).json({
    message: "Success",
    savedUser,
  });
});

export const login = catchError(async (request, response, next) => {
  const { email, password } = request.body;
  const user = await User.findOne({ email });
  const match = await bcrypt.compare(password, user ? user.password : "");
  if (user && match) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    return response.status(200).json({
      message: "Success",
      token,
      user,
    });
  }
  next(ErrorMessage(401, " Incorrect Email Or Password "));
});
