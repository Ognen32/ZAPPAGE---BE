import express from "express";
import {
  registerUser,
  hanldeGetUserByIDHeader,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { uploadAvatar } from "../middlewares/multer.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import fs from "fs/promises";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/userInfo", isAuthenticated, hanldeGetUserByIDHeader);
router.patch("/users/:id", updateUser);

router.get("/isAuth", isAuthenticated, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});

//post avatar
router.post("/user/avatar", uploadAvatar, async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId;

    if (!file) return res.status(400).json({ message: "No file uploaded" });
    if (!userId) return res.status(400).json({ message: "No userId provided" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Avatars",
      public_id: `user_${Date.now()}`,
      resource_type: "image",
      format: "webp",
    });

    fs.unlink(file.path);

    user.avatar = result.secure_url;
    await user.save();

    res.json({
      message: "Avatar uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//update avatar
router.patch("/user/avatar", uploadAvatar, async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId;

    if (!file) return res.status(400).json({ message: "No file uploaded" });
    if (!userId) return res.status(400).json({ message: "No userId provided" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (err) {
        console.warn("Failed to delete old avatar:", err.message);
      }
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Avatars",
      public_id: `user_${userId}_${Date.now()}`,
      resource_type: "image",
      format: "webp",
    });

    await fs.unlink(file.path);

    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.json({
      message: "Avatar updated successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Avatar update error:", err); // важен лог
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
