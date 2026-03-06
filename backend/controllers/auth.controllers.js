import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;

        // if user exists already
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists." });
        }

        // checks validity
        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "password must be atleast 6 characters."
            })
        }

        if (mobile.length != 10) {
            return res.status(400).json({ message: "mobile number must be 10 digits." })
        }

        // hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // created the user
        user = await User.create({
            fullName,
            email,
            role,
            mobile,
            password: hashedPassword
        })

        // create tokens
        const token = await genToken(user._id);

        // send the cookies to client
        const options = {
            secure: true, // only https?
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, //milisec
            httpOnly: true
        }
        res.cookie("token", token, options);

        // send response to client 
        res.status(201).json(user)

    } catch (error) {
        return res.status(500).json('signup error');
    }
}

export const signIn = async (req, res) => {
    try {
        const {email, password} = req.body;

        // if user exists already
        let user = await User.findOne({ email});

        if (!user) {
            return res.status(400).json({ message: "User do not exists." }); 
        }

        // unhashing the password
        const isMatch = await bcrypt.compare(password,user?.password);

        if(!isMatch)
        {
            return res.status(400).json({message: "Incorrect password"})
        }

        // create tokens
        const token = await genToken(user._id);

        // send the cookies to client
        const options = {
            secure: true, // only https?
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, //milisec
            httpOnly: true
        }
        res.cookie("token", token, options);

        // send response to client 
        res.status(200).json(user)

    } catch (error) {
        return res.status(500).json(`SignIn error ${error}`);
    }
}

export const signOut = async (req,res) => {
    try{
        // to clear the cookie that was given 
        res?.clearCookie("token")
        return res.status(200).json({
            message: "logout successfully"
        })

    }catch(error){
        return res.status(500).json({
            message : `error logging user out ${error}`
        })
    }
}

export const sendOtp = async (req,res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user)
        {
            return res.status(400).json({
                message: "User does not exist."
            })
        }

        // generate otp
        const otp = Math.floor(1000 + Math.random()*9000).toString();

       // save in database
       user.resetOtp=otp;
       user.otpExpires=Date.now() + 5*60*1000;
       user.isOtpVerified = false;

       await user.save();

       // send otp via email
       await sendOtpMail(email,otp);
       return res.status(200).json({message: "OTP sent successfully"});
    }
    catch(error){
        console.log("error encountered while sending otp with message : ", error);
        return res.status(500).json(`otp error ${error}`)
    }
}

export const verifyOtp = async (req,res) => {
    try{
        const {email,otp} = req.body;
        const user = await User.findOne({email});

        // validate data 
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now())
        {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            })
        }

        user.resetOtp = undefined;
        user.isOtpVerified = true;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "OTP verified successed"
        })
    }
    catch(error){
        return res.status(500).json({
            message: `OTP verification error : ${error}`
        })
    }
}

export const resetPassword = async (req,res) => {
    try{
        const {email,newPassword} = req.body;
        const user = await User.findOne({email});

        // validate data 
        if(!user || !user.isOtpVerified)
        {
            return res.status(400).json({
                message: "otp verification required"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfullly"
        })
    }
    catch(error)
    {
        return res.status(500).json({
            message: "Password reset error"
        })
    }
} 

export const googleAuth = async (req,res)=> {
    try{
        const {fullName,email,mobile,role} = req.body;

        let user = await User.findOne({email});

        if(!user)
        {
            user = await User.create({
                fullName,email,mobile,role
            })
        }

        // token generation 
        const token = await genToken(user._id);

        res.cookie('token', token, {
            secure: true,
            sameSite: "None",
            maxAge:7*24*60*60*1000,
            httpOnly: true
        })

        return res.status(200).json(user);

    }
    catch(error){
       return res.status(500).json({
    message: error.message || "Google authentication failed"
  });
    }
}


