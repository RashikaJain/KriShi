/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FaRegEye } from "react-icons/fa"
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import {auth} from "../../firebase.js"
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from "../redux/userSlice.js"

function SignUp() {
    const primaryColor = "#FF6A3D";
    const hoverColor = "#E85A2C";
    const bgColor = "#FFF9f6";
    const borderColor = "#E6E6E6";

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("user");
    const navigate = useNavigate() // to navigate the user on interaction
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('')
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();

    // fetch function
    const handleSignUp = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName,
                email,
                password,
                mobile,
                role
            }, { withCredentials: true });
            dispatch(setUserData(result.data));
            setError('');
        }
        catch (err) {
            setError(`*${err?.response?.data?.message}`)
            setLoading(false);
        }
    }

    const handleGoogleAuth = async () => {
        if(!mobile)
        {
            return setError("*Mobile number is required");
        }
        try{
            const provider =  new GoogleAuthProvider();
            const result = await signInWithPopup(auth,provider);
            console.log(result);
            const {data} = await axios.post(`${serverUrl}/api/auth/google-auth`,{
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            },{withCredentials:true})

            dispatch(setUserData(data));
            setError('');
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 ' style={{ backgroundColor: bgColor }}>
            <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]`}
                style={{ border: `1px solid ${borderColor}` }}>
                <h1 className={`text-3xl font-bold mb-2`} style={{ color: `${primaryColor}` }}>KriShi</h1>
                <p className='text-gray-600 mb-8'>Create your account to get started with delicious food deliveries</p>

                {/* fullname */}
                <div className='mb-4'>
                    <label htmlFor='fullName' className='block text-gray-700 font-medium mb-1'>Full Name: </label>
                    <input type="text" className='w-full border rounded-lg px-3 py-2 
                    border-gray-200 focus:outline-none focus:border-orange-500
                    ' placeholder='Enter your Full Name' onChange={(e) => setFullName(e.target.value)} value={fullName} required/>
                </div>

                {/* email */}
                <div className='mb-4'>
                    <label htmlFor='email' className='block text-gray-700 font-medium mb-1'>Email: </label>
                    <input type="email" className='w-full border rounded-lg px-3 py-2 
                    border-gray-200 focus:outline-none focus:border-orange-500
                    ' placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} value={email} required/>
                </div>

                {/* mobile */}
                <div className='mb-4'>
                    <label htmlFor='mobile' className='block text-gray-700 font-medium mb-1'>Mobile: </label>
                    <input type="text" className='w-full border rounded-lg px-3 py-2 
                    border-gray-200 focus:outline-none focus:border-orange-500
                    ' placeholder='Enter your Mobile Number' onChange={(e) => setMobile(e.target.value)} value={mobile} required />
                </div>

                {/*  password*/}
                <div className='mb-4'>
                    <label htmlFor='password' className='block text-gray-700 font-medium mb-1'>Password: </label>
                    <div className='relative'>
                        <input type={showPassword ? "text" : "password"} className='w-full border rounded-lg px-3 py-2 
                    border-gray-200 focus:outline-none focus:border-orange-500
                    ' placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                        <button onClick={() => { setShowPassword((val) => !val) }} className='absolute right-3 cursor-pointer top-3 text-gray-500'>{showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                    </div>
                </div>

                {/* role */}
                <div className='mb-4'>
                    <label htmlFor='role' className='block text-gray-700 font-medium mb-1'>Role: </label>
                    <div className='flex gap-2'>
                        {["user", "owner", "deliveryBoy"].map((r, ind) => {
                            return <button key={ind} className='flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer' style={
                                role == r ? { backgroundColor: primaryColor, color: 'white' } : { border: `1px solid #1e4534`, color: "#333" }
                            } onClick={() => {
                                setRole(r)
                            }}
                            >{r}</button>
                        })}
                    </div>
                </div>

                {/* SignUp */}
                <button className={`w-full font-semibold py-2 rounded-lg transition-all duration-200 bg-[#FF6A3D] text-white hover:bg-[#E85A2C] cursor-pointer`}
                    onClick={handleSignUp} disabled={loading}>
                    {loading?<ClipLoader size={20} color='white'/>: 'SignUp'}
                </button>

                <p className='text-red-500 text-center my-[10px]'>{error}</p>

                {/* google signup */}
                <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100' onClick={handleGoogleAuth}>
                    <FcGoogle size={20} />
                    <span>Sign up with Google</span>
                </button>

                {/* Sign in */}
                <p onClick={() => navigate("/signin")} className='text-center cursor-pointer mt-6'>Already have an account ? <span className='text-[#FF6A3D]' >Sign In</span></p>
            </div>
        </div>
    )
}

export default SignUp