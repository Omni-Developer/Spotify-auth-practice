const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function register(req, res) {
  const { username, email, password, role = "listener" } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hash,
      role,
    });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token);
    res.status(201).json({
      message: "user Registerd successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.log("Error while registering user", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "invalid credentials" });
  }
  if (!user.password) {
    return res.status(500).json({ message: "user password is not set" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "invalid credentials" });
  }
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      profilePic: user.profilePic,
    },
  });
}

async function getProfile(req, res) {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log("Error while getting profile", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateProfile(req, res) {
  try {
    const { bio } = req.body;
    const profilePicFile = req.files?.profilePic?.[0];

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update bio
    if (bio !== undefined) {
      user.bio = bio;
    }

    // Upload profile picture if provided
    if (profilePicFile) {
      const { uploadFile } = require("../services/storage.service");
      const profilePicFileName = `profile_${Date.now()}_${profilePicFile.originalname}`;
      const uploadResult = await uploadFile(
        profilePicFile.path,
        profilePicFileName,
      );
      user.profilePic = uploadResult.url;

      // Clean up temp file
      const fs = require("fs");
      if (fs.existsSync(profilePicFile.path)) {
        fs.unlinkSync(profilePicFile.path);
      }
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.log("Error while updating profile", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  register,
  loginUser,
  getProfile,
  updateProfile,
};
