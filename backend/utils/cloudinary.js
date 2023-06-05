const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryUploadImg = async (filesToUpload) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filesToUpload, (result) => {
            resolve(
                {
                    url: result.secure_url,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

module.exports = cloudinaryUploadImg;
