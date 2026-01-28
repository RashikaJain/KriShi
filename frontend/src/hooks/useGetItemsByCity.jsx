import React, { useEffect } from 'react'
import { serverUrl } from "../App.jsx"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity } from '../redux/userSlice.js'

function useGetItemsByCity() {
    const dispatch = useDispatch();
    const { currentCity } = useSelector(state => state.user)
    useEffect(() => {
        (async function () {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`, { withCredentials: true })
                dispatch(setItemsInMyCity(result.data))
                console.log(result.data);
            }
            catch (error) {
                console.log("error loading items: ", error.response);
            }
        })();
    }, [currentCity])
}

export default useGetItemsByCity