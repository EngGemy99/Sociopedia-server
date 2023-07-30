import User from "../../../models/User.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
/* READ */
export const getUser = catchError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("friends");
  if (!user) return next(ErrorMessage(409, "User Not Found 🙄"));
  res.status(200).json({ user });
});

export const getAllUser = catchError(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

export const getUserFriends = catchError(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("friends");
  res.status(200).json({
    message: "All User Friends",
    friends: user.friends,
  });
});

/* UPDATE */
export const addRemoveFriend = catchError(async (req, res) => {
  const { userId, friendId } = req.params;
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((id) => id != friendId);
    friend.friends = friend.friends.filter((id) => id != userId);
  } else {
    user.friends.push(friend);
    friend.friends.push(user);
  }
  await user.save();
  await friend.save();
  res.status(200).json({
    user,
    message: "done",
    user,
  });
});
