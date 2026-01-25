import React, { useEffect } from 'react'
import { serverUrl }  from "../App.jsx"
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js';

function useGetCurrentUser() {
    const dispatch = useDispatch();
    useEffect(()=>{
        (async function () {
            try{
                const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
                dispatch(setUserData(result.data))
            } 
            catch(error)
            {
                console.log("user must signup/login: ",error.response);
            }
        })();
    },[])
}

export default useGetCurrentUser