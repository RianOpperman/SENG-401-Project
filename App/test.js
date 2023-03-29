const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 2500,
  secure: false, // set to true if using SSL/TLS
});

// Define the email message
const message = {
  from: "filminder@filminder.com",
  to: "joe@local.com",
  subject: "Test email",
  text: "This is a test email sent using Node.js and Nodemailer",
};

// Send the email
transporter.sendMail(message, (error, info) => {
  if (error) {
    console.log("Error sending email:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});