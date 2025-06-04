const cloudinary = require('../config/cloudinary')
const fs = require('fs')


async function uploadAndTransform(picPath) {
  try {
    // Upload the local image file
    const uploadResult = await cloudinary.uploader.upload(picPath, {
      folder: 'profile_pics',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    console.log("✅ Upload successful:");
    //console.log(uploadResult);

    const publicId = uploadResult.public_id;

    // Generate optimized delivery URL
    const optimizeUrl = cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    // Generate auto-cropped square image URL
    const autoCropUrl = cloudinary.url(publicId, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    //console.log("📦 Optimized URL:", optimizeUrl);
    //console.log("✂️ Cropped URL:", autoCropUrl);

    fs.unlinkSync(picPath);
    
    return {
      //original: uploadResult.secure_url,
      //optimized: optimizeUrl,
      cropped: autoCropUrl
    };

  } catch (err) {
    console.error("❌ Upload failed:", err);
    throw err;
  }
}

module.exports = uploadAndTransform