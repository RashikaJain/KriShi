import React, { useEffect } from 'react'
import { serverUrl }  from "../App.jsx"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setShopInMyCity } from '../redux/userSlice.js'

function useGetShopByCity() {
    const dispatch = useDispatch();
    const {currentCity} = useSelector(state=>state.user)
    useEffect(()=>{
        (async function () {
            try{
                const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,{withCredentials:true})
                dispatch(setShopInMyCity(result.data))
                console.log(result.data);
            } 
            catch(error)
            {
                console.log("error loading shop: ",error.response);
            }
        })();
    },[currentCity])
}

export default useGetShopByCity