import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setCity } from '../redux/userSlice.js';

function useGetCity() {
    const dispatch = useDispatch();
    const {userData} =  useSelector(state=>state.user)
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(async (position)=>{
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // api to get the city using longitude and latitude =>  geoapify
        const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`)

        console.log("result is: ", result)
        
        dispatch(setCity(result.data.results[0].city))
        })
    },[userData]) // all the custom hooks are taken inside this 
}

export default useGetCity

