const fs = require("fs");

const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");

const { uploadFile } = require("../services/storage.service");

/*
|--------------------------------------------------------------------------
| Upload Music
|--------------------------------------------------------------------------
*/
async function uploadMusic(req, res) {
  const { title } = req.body;
  const audioFile = req.files?.file?.[0];
  const coverImageFile = req.files?.coverImage?.[0];

  // Validation
  if (!title) {
    return res.status(400).json({
      message: "Music title is required",
    });
  }

  if (!audioFile) {
    return res.status(400).json({
      message: "No audio file uploaded",
    });
  }

  if (!coverImageFile) {
    return res.status(400).json({
      message: "Cover image is required",
    });
  }

  try {
    // Upload audio file
    const audioFileName = `music_${Date.now()}_${audioFile.originalname}`;
    const audioUploadResult = await uploadFile(audioFile.path, audioFileName);

    // Upload cover image
    const coverFileName = `cover_${Date.now()}_${coverImageFile.originalname}`;
    const coverUploadResult = await uploadFile(
      coverImageFile.path,
      coverFileName,
    );

    // Remove temp files
    if (fs.existsSync(audioFile.path)) {
      fs.unlinkSync(audioFile.path);
    }
    if (fs.existsSync(coverImageFile.path)) {
      fs.unlinkSync(coverImageFile.path);
    }

    // Save music in DB
    const music = await musicModel.create({
      title,
      uri: audioUploadResult.url,
      coverImage: coverUploadResult.url,
      artist: req.artistId,
    });

    // Populate artist username
    const populatedMusic = await music.populate("artist", "username");

    return res.status(201).json({
      message: "Music uploaded successfully",
      music: populatedMusic,
    });
  } catch (err) {
    console.log("Error while uploading music", err);

    // Cleanup temp files if upload fails
    if (audioFile?.path && fs.existsSync(audioFile.path)) {
      fs.unlinkSync(audioFile.path);
    }
    if (coverImageFile?.path && fs.existsSync(coverImageFile.path)) {
      fs.unlinkSync(coverImageFile.path);
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
|--------------------------------------------------------------------------
| Create Album
|--------------------------------------------------------------------------
*/
async function createAlbum(req, res) {
  const { title, musicIds } = req.body;
  const coverImageFile = req.files?.coverImage?.[0];

  // Validation
  if (!title) {
    return res.status(400).json({
      message: "Album title is required",
    });
  }

  if (!musicIds || JSON.parse(musicIds || "[]").length === 0) {
    return res.status(400).json({
      message: "Select at least one track",
    });
  }

  try {
    let coverImageUrl = null;

    // Upload cover image if provided
    if (coverImageFile) {
      const coverFileName = `album_cover_${Date.now()}_${coverImageFile.originalname}`;
      const coverUploadResult = await uploadFile(
        coverImageFile.path,
        coverFileName,
      );
      coverImageUrl = coverUploadResult.url;

      // Clean up temp file
      if (fs.existsSync(coverImageFile.path)) {
        fs.unlinkSync(coverImageFile.path);
      }
    }

    // Parse musicIds if it's a string (from FormData)
    const parsedMusicIds =
      typeof musicIds === "string" ? JSON.parse(musicIds) : musicIds;

    // Create album
    const album = await albumModel.create({
      title,
      musics: parsedMusicIds,
      artist: req.artistId,
      coverImage: coverImageUrl,
    });

    const populatedAlbum = await album.populate("artist", "username");

    return res.status(201).json({
      message: "Album created successfully",
      album: populatedAlbum,
    });
  } catch (err) {
    console.log("Error while creating album", err);

    // Clean up temp file if upload fails
    if (coverImageFile?.path && fs.existsSync(coverImageFile.path)) {
      fs.unlinkSync(coverImageFile.path);
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
|--------------------------------------------------------------------------
| Get All Music
|--------------------------------------------------------------------------
*/
const GetAllMusic = async (req, res) => {
  try {
    const { userId, userRole } = req;

    let query = {};

    // If artist → only their music
    if (userRole === "artist") {
      query.artist = userId;
    }

    const music = await musicModel
      .find(query)
      .populate("artist", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json(music);
  } catch (err) {
    console.log("Error while retrieving music", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Albums
|--------------------------------------------------------------------------
*/
const GetAllAlbums = async (req, res) => {
  try {
    const albums = await albumModel
      .find()
      .populate("artist", "username")
      .populate({
        path: "musics",
        populate: {
          path: "artist",
          select: "username",
        },
      })
      .sort({ createdAt: -1 });

    // FRONTEND EXPECTS ARRAY DIRECTLY
    return res.status(200).json(albums);
  } catch (err) {
    console.log("Error while getting albums", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Album By ID
|--------------------------------------------------------------------------
*/
const GetAlbumById = async (req, res) => {
  const { id } = req.params;

  try {
    const album = await albumModel
      .findById(id)
      .populate("artist", "username")
      .populate({
        path: "musics",
        populate: {
          path: "artist",
          select: "username",
        },
      });

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
      });
    }

    // FRONTEND EXPECTS OBJECT DIRECTLY
    return res.status(200).json(album);
  } catch (err) {
    console.log("Error while getting album by id", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  uploadMusic,
  createAlbum,
  GetAllMusic,
  GetAllAlbums,
  GetAlbumById,
};
