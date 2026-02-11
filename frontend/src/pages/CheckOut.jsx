import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { IoMdArrowBack } from "react-icons/io"
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5"
import { TbCurrentLocation } from "react-icons/tb"
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet"
import { useDispatch, useSelector } from 'react-redux'
import 'leaflet/dist/leaflet.css';
import { setAddress, setLocation } from '../redux/mapSlice'
import { MdDeliveryDining } from "react-icons/md"
import { FaCreditCard, FaMobileScreenButton } from "react-icons/fa6"
import axios from "axios"
import {serverUrl} from "../App.jsx"

function CheckOut() {
  const navigate = useNavigate();
  const { location, address } = useSelector(state => state.map)
  const [addressInput, setAddressInput] = useState("");
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { cartItems, totalAmount } = useSelector(state => state.user);
  const deliveryFee = totalAmount > 500 ? 0 : 50;
  const AmountWithDeliveryFee = totalAmount + deliveryFee;

  useEffect(() => {
    setAddressInput(address);
  }, [address])

  // backend data sending 
  const handlePlaceOrder = async () => {
    try{
      const result = await axios.post(`${serverUrl}/api/order/place-order`,{
        deliveryAddress:{
          text:addressInput,
          latitude:location.lat,
          longitude:location.lon
        },
        cartItems,
        paymentMethod,
        totalAmount
      },{withCredentials: true});
      console.log(result.data);
      navigate("/order-placed");
    }
    catch(error)
    {
      console.log("Error in placing the order: ", error);
    }
  }


  function RecenterMap({ location }) {
    if (location.lat && location.lon) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const map = useMap();
      map.setView([location.lat, location.lon], 16, { animate: true })
    }

    return null;
  }
  // we called the recenter map to recenter it 

  const OnDragEnd = (e) => {
    const lat = e.target?._latlng?.lat;
    const lon = e.target?._latlng?.lng;
    dispatch(setLocation({ lat, lon }))
    getAddressByLatLng(lat, lon)
  }

  // get address by dragging in the map 
  const getAddressByLatLng = async (lat, lon) => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`)

      dispatch(setAddress(result?.data?.results[0].address_line2));

    } catch (error) {
      console.log("error in locating the address", error);
    }
  }

  // get lat lon by address
  const getLanLonByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${import.meta.env.VITE_GEOAPIKEY}`)

      const { lat, lon } = result.data.features[0].properties;

      console.log(lat, lon)

      dispatch(setLocation({ lat, lon }))

    } catch (error) {
      console.log(error);
    }
  }

  // Get current location
  const getCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      dispatch(setLocation({ lat, lon }));
      getAddressByLatLng(lat, lon)
    })
  }

  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
      {/* back arrow */}
      <div className='absolute top-[20px] left-[20px] z-[10]'>
        <IoMdArrowBack size={35} className='text-[#ff4d2d]' onClick={() => navigate('/')} />
      </div>
      {/* checkout card */}
      <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>

        {/* Maps */}
        <section>
          {/* Get Delivery Location */}
          <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'> <IoLocationSharp size={25} className='text-[#ff4d2d]' />Delivery Location</h2>
          <div className='flex gap-2 mb-3'>

            {/* Location Search Input */}
            <input type="text" className='flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter your Delivery Address..' value={addressInput} onChange={(e) => setAddressInput((e.target.value))} />

            {/* Search Location */}
            <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={() => getLanLonByAddress()}><IoSearchOutline size={17} /></button>

            {/* Get Current Location */}
            <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={getCurrentLocation}>
              <TbCurrentLocation size={17} />
            </button>
          </div>

          {/* To apply maps */}
          <div className='rounded-xl border overflow-hidden'>
            <div className='h-64 w-full flex items-center justify-center'>
              <MapContainer className='w-full h-full'
                center={[location?.lat, location?.lon]} scrollWheelZoom={false} zoom={16}>
                <TileLayer
                  attribution='&copy; 
                  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: OnDragEnd }} >
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>

        {/* Payments */}
        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Payment Method</h2>

          {/* COD */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod == "cod" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray:300"}`} onClick={() => setPaymentMethod("cod")}>

              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                <MdDeliveryDining className='text-green-800 text-xl' />
              </span>

              <div>
                <p className='font-medium text-gray-800'>Cash on Delivery</p>
                <p className='text-xs test-gray-500'>Pay when your food arrives</p>
              </div>

            </div>

            {/* Online Delivery */}
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod == "online" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray:300"}`} onClick={() => setPaymentMethod("online")}>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                <FaMobileScreenButton className='text-purple-700 text-xl' />
              </span>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                <FaCreditCard className='text-blue-700 text-xl' />
              </span>

              <div className='font-medium text-gray-800'>UPI/Credit/Debit</div>
              <p className='text-xs text-gray-500'>Pay Securely Online</p>
            </div>

          </div>
        </section>

        {/* Order Summary */}
        <section>

          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Summary</h2>

          {/* Cart Items */}
          <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
            {cartItems.map((item, idx) => (
              <div key={idx} className='flex justify-between text-sm text-gray-700'>
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr className='border-gray-300  my-2' />

            {/* Delivery fee */}
            <div className='flex justify-between font-medium text-gray-700'>
              <span>SubTotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className='flex justify-between text-gray-600'>
              <span>Delivery Fee</span>
              <span>{deliveryFee == 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            <div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
              <span>Total</span>
              <span>{AmountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        {/* Checkout button */}
        <button className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold' onClick={handlePlaceOrder}>{paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}</button>

      </div>
    </div>
  )
}

export default CheckOut