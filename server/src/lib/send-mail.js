const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mailOptions = {
  from: {
    name: "Web Man",
    address: process.env.GMAIL_USER,
  },
  to: "harzhedzmig@gmail.com",
  subject: "Hello",
  text: "Hello world?",
  html: "<b>Hello World?</b>",
};

const sendMail = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log(error);
  }
};

sendMail(transporter, mailOptions);
