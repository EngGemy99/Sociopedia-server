import express from "express";
import { login, register } from "./authController.js";
import { fileUpload } from "../../utils/FileUpload.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", fileUpload("picture"), register);

export default router;
