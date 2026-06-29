const express = require("express");
const multer = require("multer");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Multer storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/register", authController.register);
router.post("/login", authController.loginUser);
router.get("/profile", authMiddleware.auth, authController.getProfile);
router.post(
  "/profile",
  authMiddleware.auth,
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  authController.updateProfile,
);

module.exports = router;
