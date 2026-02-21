/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { } from "../pages/Home.jsx"
import { serverUrl } from '../App.jsx';

function useUpdateLocation() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const updateLocation = async (lat, lon) => {
            const result = await axios.post(`${serverUrl}/api/user/update-location`, { lat, lon }, { withCredentials: true });

            console.log(result.data);
        }

        // to watch it that where the deliveryboy is
        navigator.geolocation.watchPosition((pos)=>{
            updateLocation(pos.coords.latitude, pos.coords.longitude)
        })
    }, [userData])
}

export default useUpdateLocation

