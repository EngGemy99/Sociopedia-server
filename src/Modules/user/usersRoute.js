import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getAllUser,
} from "./usersController.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/", getAllUser);

router.get("/:id/friends", getUserFriends);

router.patch("/:userId/:friendId", addRemoveFriend);

export default router;
