import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        message: "No image selected",
      });
    }

    const file = req.files.image;

    const result = await cloudinary.uploader.upload(
      file.tempFilePath,
      {
        folder: "metalconnect",
      }
    );

    res.status(200).json({
      image: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Image upload failed",
    });
  }
};