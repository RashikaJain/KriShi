import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env"
});

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",   // Gmail SMTP service
  port: 465,          // Gmail secure SMTP port
  secure: true,       // true for port 465
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// Send OTP for password reset
export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: to,
    subject: "Reset your Password",
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires within 5 minutes.</p>`
  });
};

// Send OTP for delivery confirmation
export const sendDeliveryOtpMail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Confirm your order delivery",
    html: `
      <p>Your OTP for confirming the order delivery is <b>${otp}</b>. It expires within 5 minutes.</p>
      <br/>
      <p>We hope you will like your order.</p>
    `
  });
};
