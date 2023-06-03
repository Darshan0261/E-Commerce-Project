const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const sendEmail = asyncHandler(async (data) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MP,
        },
    });

    let info = await transporter.sendMail({
        from: '"Hey 👻" <darshan@example.com>',
        to: data.to,
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html, // html body
    });
});

module.exports = sendEmail;
