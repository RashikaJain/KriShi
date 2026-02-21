import mongoose from "mongoose";

const {Schema}  = mongoose;

const userSchema = new Schema({
    fullName:  {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    mobile: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user","owner","deliveryBoy"],
        required: true
    },
    resetOtp: {
        type: String
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    otpExpires: {
        type: Date
    },
    // jio json format => to get data in map format
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0,0]
        }
    }
},{timestamps: true})

const User = mongoose.model("User", userSchema);

// to treat the location like a map
userSchema.index({'location': '2dsphere' }) 

// mongodb jb bhi modelstore krta h it becomes plural User will become Users

export default User;