import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from "react-router-dom"
import UserOrderCard from "../components/UserOrderCard.jsx"
import OwnerOrderCard from "../components/OwnerOrderCard.jsx"
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice.js';

function MyOrders() {
  const { userData, myOrders, socket } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('newOrder', (data) => {
      console.log('newOrder received in MyOrders:', data);

      if (data.shopOrders?.owner._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]));
      }
    })

    socket.on('update-status', ({ userId, orderId, shopId, status }) => {
      console.log("reached within the update-status socket frontend")
      if (userId == userData._id) {
        console.log("updating the status in realtime using socket.io")
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
      }
    })

    return () => {
      socket?.off('newOrder');
      socket?.off('update-status')
    }
  }, [socket])

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className='w-full max-w-[800px] p-4'>

        {/* Navigation and back icons */}
        <div className='flex  items-center items-center justify-center gap-[20px] mb-6 '>
          <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
            <IoMdArrowBack size={35} className='text-[#ff4d2d]' onClick={() => navigate('/')} />
          </div>

          <h1 className='text-2xl  font-bold text-start '>My Orders</h1>
        </div>

        <div className='space-y-6'>
          {myOrders?.map((order, index) => {
            return (userData.role == "user" ? (
              <UserOrderCard data={order} key={index} />
            ) : (userData.role == "owner") ? (
              <OwnerOrderCard data={order} key={index} />
            )
              :
              null)
          })}
        </div>
      </div>
    </div>
  )
}

export default MyOrders  