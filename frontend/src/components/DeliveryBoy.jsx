/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import Nav from "./Nav.jsx"
import { useSelector } from 'react-redux'
import axios from "axios"
import { } from "../pages/Home.jsx"
import { serverUrl } from '../App.jsx'
import DeliveryBoyTracking from "./DeliveryBoyTracking.jsx"

function DeliveryBoy() {
  const { userData, socket } = useSelector(state => state.user);
  const [currentOrder, setCurrentOrder] = useState(null)
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");

  // available assignments 
  const [availableAssignments, setAvailableAssignments] = useState(null);

  // get all the available orders as we enter the page 
  const getAssignment = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true });

      console.log("get-assignments result is: ", result.data)
      setAvailableAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  // to get the current order
  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true }
      )
      setCurrentOrder(result.data);
      console.log(result.data);
    }
    catch (error) {
      console.log(`frontend: get current order error: , ${error}`)
    }
  }

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true });
      console.log(result.data)
      await getCurrentOrder();
    } catch (error) {
      console.log(error)
    }
  }

  const verifyOtp = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id
        , otp
      }, { withCredentials: true });
      alert("Order reached successfully, refresh to see more orders")
    } catch (error) {
      console.log(error)
    }
  }

  const sendOtp = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`, { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id }, { withCredentials: true });
      setShowOtpBox(true);
    } catch (error) {
      console.log(error)
    }
  }

  // real time data effect 
  useEffect(() => {
    socket?.on('newAssignments', (data) => {
      if (data.sentTo == userData._id) {
        setAvailableAssignments(prev => [data, ...prev])
      }
    })

    return () => {
      socket.off('newAssignments')
    }
  }, [socket])


  useEffect(() => {
    getAssignment();
    getCurrentOrder();
  }, [userData])

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>

      {/* Nav bar */}
      <Nav />

      {/* Delivery Boy Identity */}
      <div className='w-full max-w-[800px] flex flex-col  gap-5 items-center'>
        <div className='bg-white rounded-2xl shadow-md p-5 flex-col flex justify-start items-center w-[90%] border border-orange-100 text-center gap-4'>

          {/* Welcome Board */}
          <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome,  {userData.fullName}</h1>

          {/* Longitude and Latitude */}
          <p className='text-[#ff4d2d]'><span className='font-semibold'>Latitude:</span> {userData.location.coordinates[1]}, <span className='font-semibold'>Longitude:</span> {userData.location.coordinates[0]}</p>
        </div>

        {/* DeliveryRequests */}
        {!currentOrder &&
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>Available Orders</h1>
            <div className='space-y-4'>
              {availableAssignments?.length > 0 ? (
                availableAssignments.map((a, index) => (

                  // Get all the details for the items that we get 
                  <div className="border rounded-lg p-4 flex justify-between items-center" key={index}>
                    <div>
                      <p className='text-sm font-semibold'>{a?.shopName}</p>
                      <p className='text-sm text-gray-500'><span className='font-semibold'>
                        Delivery Address:</span> {a?.deliveryAddress.text}</p>
                      <p className='text-xs text-gray-500'>{a.items.length} item(s) | {a.subtotal}</p>
                    </div>

                    <button className='bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600' onClick={() => {
                      acceptOrder(a.assignmentId)
                    }}>Accept</button>
                  </div>
                ))
              ) :
                <div className='text-gray-400 text-sm'>No Available Orders</div>
              }
            </div>
          </div>
        }

        {
          currentOrder &&
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100 '>
            <h2 className='text-lg font-bold mb-3'>📦Current Order</h2>
            <div className='border rounded-lg p-4 mb-3'>
              <p className="">{currentOrder?.shopOrder.shop.name}</p>
              <p className="text-sm text-gray-500">{currentOrder?.deliveryAddress?.text}</p>
              <p className='text-xs text-gray-500'>{currentOrder.shopOrder?.shopOrderItems.length} item(s) | {currentOrder?.shopOrder?.subtotal}</p>
            </div>

            <DeliveryBoyTracking data={currentOrder} />

            {/* OTP BOX */}
            {!showOtpBox ?
              <button className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200' onClick={sendOtp}>
                Mark As Delivered
              </button> :
              <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
                <p>Enter Otp sent to <span className='text-orange-500'>{currentOrder.user.fullName}</span></p>

                {/* input field */}
                <input type="text" className='w-full border px-3 py-2 rounded-lg mt-3 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400' placeholder='Enter OTP' onChange={(e) => setOtp(e.target.value)} value={otp} />
                <button className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all" onClick={verifyOtp}>Submit OTP</button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default DeliveryBoy