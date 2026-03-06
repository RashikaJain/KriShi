import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS   // Gmail App Password (not normal password)
  },
  connectionTimeout: 10000
})


// Send OTP for password reset
export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"KriShi Support" <${process.env.EMAIL}>`,
      to: to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Password Reset Request</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    })

    console.log("OTP mail sent to:", to)

  } catch (error) {
    console.error("Error sending OTP mail:", error)
    throw new Error("Failed to send OTP mail")
  }
}


// Send delivery confirmation OTP
export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    await transporter.sendMail({
      from: `"KriShi Delivery" <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Confirm Your Order Delivery",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Delivery Confirmation</h2>
          <p>Your OTP for confirming the delivery is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
          <p>Thank you for ordering with <b>KriShi</b>.</p>
        </div>
      `
    })

    console.log("Delivery OTP mail sent to:", user.email)

  } catch (error) {
    console.error("Error sending delivery OTP mail:", error)
    throw new Error("Failed to send delivery OTP mail")
  }
}
