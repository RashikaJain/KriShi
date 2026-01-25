/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { ClipLoader } from "react-spinners"

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('')
    const navigate = useNavigate()
    const [err,setErr] = useState('')
    const [loading,setLoading] = useState(false);

    const handleSendOtp = async () =>{
        try{
            setLoading(true);
            const result =await axios.post(`${serverUrl}/api/auth/send-otp`,{email},{ withCredentials: true});
            console.log(result);
            setErr("");
            setLoading(false);
            setStep(2);
        }
        catch(error)
        {
            setErr(`*${error?.response?.data?.message}`)
            setLoading(false);
        }
    }

    const handleVerifyOtp = async () =>{
        try{
            setLoading(true);
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp},{ withCredentials: true});
            console.log(result);
            console.log(result.status)
            setLoading(false);
            setErr("")
            setStep(3);
        }
        catch(error)
        {
           setErr(`*${error?.response?.data?.message}`)
           setLoading(false);
        }
    }
    const handleResetPassword = async () =>{
        if(newPassword != confirmPassword)
        return null
        try{
            setLoading(true);
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`,{email,newPassword},{ withCredentials: true});
            console.log(result);
            setErr("");
            setLoading(false);
            navigate('/signin')
        }
        catch(error)
        {
            setErr(`*${error?.response?.data?.message}`)
            setLoading(false);
        }
    }

    return (
        <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
            {/* forgot password */}
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>

                {/* forgot password caption */}
                <div className='flex items-center gap-4'>
                    <IoMdArrowRoundBack size={30} className='text-[#FF6A3D] cursor-pointer' onClick={() => navigate("/signin")} />
                    <h1 className='text-2xl font-bold text-[#FF6A3D]text-center'>Forgot Password</h1>
                </div>

                {/* step 1*/}
                {step == 1 &&
                    <div>
                        <div className='mb-6 mt-6'>
                            <label htmlFor='email' className='block text-gray-700 font-medium mb-1'>Email: </label>
                            <input type="email" className='w-full border rounded-lg px-3 py-2 
                    border-gray-200 focus:outline-none focus:border-orange-500
                    ' placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                        </div>

                        <button className={`w-full font-semibold py-2 rounded-lg transition-all duration-200 bg-[#FF6A3D] text-white hover:bg-[#E85A2C] cursor-pointer`} onClick={handleSendOtp} disabled={loading}>
                            {loading?<ClipLoader size={20} color='white'/>: 'Send OTP'}
                        </button>
                        <p className='text-red-500 text-center my-[10px]'>{err}</p>
                    </div>}

                {/* step 2 */}
                {step == 2 &&
                    <div>
                        <div className='mb-6 mt-6'>
                            <label htmlFor='email' className='block text-gray-700 font-medium mb-1'>OTP </label>
                            <input type="email" className='w-full border rounded-lg px-3 py-2 
                    border-gray-200 focus:outline-none focus:border-orange-500
                    ' placeholder='Enter OTP' onChange={(e) => setOtp(e.target.value)} value={otp} required />
                        </div>

                        <button className={`w-full font-semibold py-2 rounded-lg transition-all duration-200 bg-[#FF6A3D] text-white hover:bg-[#E85A2C] cursor-pointer`} onClick={handleVerifyOtp} disabled={loading}>
                            {loading?<ClipLoader size={20} color='white'/>: 'Verify OTP'}
                        </button>
                        <p className='text-red-500 text-center my-[10px]'>{err}</p>
                    </div>
                }

                {/* step 3 */}
                {step == 3 &&
                    <div>
                        <div className='mb-6 mt-6'>
                            <label htmlFor='newPassword' className='block text-gray-700 font-medium mb-1'>New Password </label>
                            <input type="email" className='w-full border rounded-lg px-3 py-2 
                    border-gray-200 focus:outline-none focus:border-orange-500
                    ' placeholder='Enter new Password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required />
                        </div>

                        <div className='mb-6 mt-6'>
                            <label htmlFor='confirmPassword' className='block text-gray-700 font-medium mb-1'>Confirm Password </label>
                            <input type="email" className='w-full border rounded-lg px-3 py-2 
                    border-gray-200 focus:outline-none focus:border-orange-500
                    ' placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                        </div>

                        <button className={`w-full font-semibold py-2 rounded-lg transition-all duration-200 bg-[#FF6A3D] text-white hover:bg-[#E85A2C] cursor-pointer`} onClick={handleResetPassword} disabled={loading}>
                        {loading?<ClipLoader size={20} color='white'/>: 'Reset Password'}
                        </button>
                        <p className='text-red-500 text-center my-[10px]'>{err}</p>
                    </div>
                }
        </div>
        </div >
    )
}
