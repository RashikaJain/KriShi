import React, { useEffect } from 'react'
import { serverUrl }  from "../App.jsx"
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setMyShopData } from "../redux/ownerSlice.js"

function useGetMyShop() {
    const dispatch = useDispatch();
    useEffect(()=>{
        (async function () {
            try{
                const result = await axios.get(`${serverUrl}/api/shop/get-my`,{withCredentials:true})
                dispatch(setMyShopData(result.data))
            } 
            catch(error)
            {
                console.log("error loading shop: ",error.response);
            }
        })();
    },[])
}

export default useGetMyShop