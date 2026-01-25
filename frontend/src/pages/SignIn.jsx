/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FaRegEye } from "react-icons/fa"
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from "../redux/userSlice.js"

function SignIn() {
  const primaryColor = "#FF6A3D";
  const hoverColor = "#E85A2C";
  const bgColor = "#FFF9f6";
  const borderColor = "#E6E6E6";

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate() // to navigate the user on interaction
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // fetch function
  const handleSignIn = async () => {
    try {
      setLoading(true);
      const result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email,
        password,
      }, { withCredentials: true });
      // “Include cookies, authorization headers, or TLS client certificates in this request — even if it’s going to another domain.”
      dispatch(setUserData(result.data))
      setLoading(false);
      setErr("");
    }
    catch (error) {
      setErr(`*${error?.response?.data?.message}`)
      setLoading(false);
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        email: result.user.email,
      }, { withCredentials: true })
      dispatch(setUserData(data))
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 ' style={{ backgroundColor: bgColor }}>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]`}
        style={{ border: `1px solid ${borderColor}` }}>
        <h1 className={`text-3xl font-bold mb-2`} style={{ color: `${primaryColor}` }}>Vingo</h1>
        <p className='text-gray-600 mb-8'>Login into your account to get started with delicious food deliveries</p>

        {/* email */}
        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-700 font-medium mb-1'>Email: </label>
          <input type="email" className='w-full border rounded-lg px-3 py-2 
                    border-gray-200 focus:outline-none focus:border-orange-500
                    ' placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} value={email} required />
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

        {/* forgot password */}
        <div className='text-right cursor-pointer mb-4 text-[#FF6A3D]' onClick={() => navigate("/forgot-password")}>
          Forgot Password
        </div>

        {/* SignIn */}
        <button className={`w-full font-semibold py-2 rounded-lg transition-all duration-200 bg-[#FF6A3D] text-white hover:bg-[#E85A2C] cursor-pointer`}
          onClick={handleSignIn} disabled={loading}>
          {loading ? <ClipLoader size={20} color='white' /> : 'SignIn'}
        </button>

        <p className='text-red-500 text-center my-[10px]'>{err}</p>

        {/* google signup */}
        <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100'
          onClick={handleGoogleAuth}>
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        {/* Sign in */}
        <p onClick={() => navigate("/signup")} className='text-center cursor-pointer mt-6'>Want to create a new account? <span className='text-[#FF6A3D]' >Sign Up</span></p>
      </div>
    </div>
  )
}

export default SignIn