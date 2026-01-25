import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

const transporter = nodemailer.createTransport({
  service: "Gmail",  // it will send the request to the gmail api 
  port: 465,             // gmail port is 465 to yhan pe request jaegi
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to,otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "Reset your Password",
        html: `<p>Your OTP for password reset  is <b>${otp}</b>. It expires within 5 minutes.</p>`
    })
}