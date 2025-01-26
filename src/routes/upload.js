const express = require("express");
const multer = require("multer");
const path = require("path");
const { Photo } = require("../models");

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// GET the latest photo
router.get("/", async (req, res) => {
  try {
    const latestPhoto = await Photo.findOne({ order: [["id", "DESC"]] });
    if (latestPhoto) {
      res.json({
        imagePath: `/uploads/${path.basename(latestPhoto.imagePath)}`,
      });
    } else {
      res.json({ imagePath: null });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching the photo" });
  }
});

// GET all photos
router.get("/all", async (req, res) => {
  try {
    const photos = await Photo.findAll();
    console.log("photos", photos);
    if (photos.length > 0) {
      res.json({ success: true, photos });
    } else {
      res.json({ success: true, photos: [] });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error fetching all photos" });
  }
});

// POST a new photo
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const newPhoto = await Photo.create({
      imagePath: `/uploads/${req.file.filename}`,
    });
    res.json({ success: true, photo: newPhoto });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error uploading the photo" });
  }
});

module.exports = router;
