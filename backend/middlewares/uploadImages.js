const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const asyncHandler = require("express-async-handler");
const fs = require("fs");

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(
            {
                message: "Unsupported file format",
            },
            false
        );
    }
};

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
});

const productImgResize = asyncHandler(async (req, res, next) => {
    if (!req.files) return next();

    req.files = await Promise.all(
        req.files.map(async (file) => {
            const resizedFilePath = `public/images/products/${file.filename}`;
            await sharp(file.path)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(resizedFilePath);

            // Return the updated file object

            fs.unlinkSync(file.path);

            return {
                ...file,
                path: resizedFilePath,
            };
        })
    );

    next();
});

const blogImgResize = asyncHandler(async (req, res, next) => {
    if (!req.files) return next();

    req.files = await Promise.all(
        req.files.map(async (file) => {
            const resizedFilePath = `public/images/blogs/${file.filename}`;
            await sharp(file.path)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(resizedFilePath);

            // Return the updated file object

            fs.unlinkSync(file.path);

            return {
                ...file,
                path: resizedFilePath,
            };
        })
    );

    next();
});

module.exports = {
    uploadPhoto,
    productImgResize,
    blogImgResize,
};
