import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useGetCurrentUser from './hooks/useGetCurrentUser.js'
import { useSelector } from 'react-redux'
import Home from './pages/Home.jsx'
import useGetCity, {} from  "./hooks/useGetCity.js"
import useGetMyShop from './hooks/useGetMyShop.js'
import CreateEditShop from './pages/CreateEditShop.jsx'

export const serverUrl =  "http://localhost:8000"


export default function App() {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  const {userData} = useSelector(state=>state.user) 
  return (
    <Routes>
      <Route path='/signin' element={!userData? <SignIn />: <Navigate to={"/"}/>} />
      <Route path='/signup' element={!userData?<SignUp />:<Navigate to={"/"}/>} />
      <Route path='/forgot-password' element={!userData?<ForgotPassword />:<Navigate to={"/"} />} />
      <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"} />} />
      <Route path='/create-edit-shop' element={userData?<CreateEditShop/>:<Navigate to={"/signin"} />} />
    </Routes>
  )
}
