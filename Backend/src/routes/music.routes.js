const express = require("express");
const multer = require("multer");

const MusicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/*
|--------------------------------------------------------------------------
| Upload Music (Artists Only)
|--------------------------------------------------------------------------
*/
router.post(
  "/upload",
  authMiddleware.authArtist,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  MusicController.uploadMusic,
);

/*
|--------------------------------------------------------------------------
| Get All Music (Any Logged-In User)
|--------------------------------------------------------------------------
*/
router.get("/all", authMiddleware.auth, MusicController.GetAllMusic);

/*
|--------------------------------------------------------------------------
| Create Album (Artists Only)
|--------------------------------------------------------------------------
*/
router.post(
  "/album",
  authMiddleware.authArtist,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  MusicController.createAlbum,
);

/*
|--------------------------------------------------------------------------
| Albums (ALL USERS CAN VIEW)
|--------------------------------------------------------------------------
*/
router.get("/albums", authMiddleware.auth, MusicController.GetAllAlbums);

router.get("/album/:id", authMiddleware.auth, MusicController.GetAlbumById);

module.exports = router;
