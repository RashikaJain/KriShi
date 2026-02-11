import React, { useEffect } from 'react'
import { serverUrl } from "../App.jsx"
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setMyOrders } from '../redux/userSlice.js';

function useGetMyOrders() {
    const dispatch = useDispatch();
    useEffect(() => {
        (async function () {
            try {
                const result = await axios.get(`${serverUrl}/api/order/my-orders`, { withCredentials: true })
                dispatch(setMyOrders(result.data))
                console.log(result.data);
            }
            catch (error) {
                console.log("user must signup/login: ", error.response);
            }
        })();
    }, [])
}

export default useGetMyOrders