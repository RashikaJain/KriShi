/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { serverUrl } from '../App.jsx';
import { IoIosArrowRoundBack } from "react-icons/io"
import DeliveryBoyTracking from '../components/DeliveryBoyTracking.jsx';

function TrackOrderPage() {
    const { orderId } = useParams();
    const [currentOrder, setCurrentOrder] = useState(null);
    const navigate = useNavigate();

    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true });
            setCurrentOrder(result.data);
            console.log(result.data);
        }
        catch (error) {
            console.log("error occured while tracking your order", error);
        }
    }

    useEffect(() => {
        handleGetOrder();
    }, [orderId]);

    return (
        <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>

            {/* Back Arrow */}
            <div className="relative flex  items-center gap-4 top-[20px] left-[20px] z-[10] mb[10px]" onClick={() => {
                navigate('/')
            }}>
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                <h1 className="text-2xl font-bold md:text-center">Track Orders</h1>
            </div>

            {/* Mapping  all the orders tracking */}
            {currentOrder?.shopOrders?.map((shopOrder, index) => {
                return (
                    <div className="
                    bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4" key={index}>
                        <div>
                            <p className='text-lg font-bold mb-2 text-[#ff4d2d]'>{shopOrder.shop.name}</p>
                            <p className='font-semibold'><span>Items:</span> {shopOrder.shopOrderItems.map(i => i.name).join(',')} </p>
                            <p><span className='font-semibold'>Subtotal: </span>{shopOrder.subtotal}</p>
                            <p className='mt-6'><span className='font-semibold'>Delivery  address: </span>{currentOrder?.deliveryAddress.text}</p>
                        </div>

                        {/* Delivery Boy details */}
                        {shopOrder.status != "delivered" ? <>
                            {shopOrder.assignedDeliveryBoy ?
                                <div className='text-sm text-gray-700'>
                                    <p className="font-semibold">
                                        <span>Delivery Boy Name: </span>
                                        {shopOrder.assignedDeliveryBoy.fullName}
                                    </p>
                                    <p className='font-semibold'>
                                        <span>Delivery Boy Contact Number: </span>
                                        {shopOrder.assignedDeliveryBoy.mobile}</p>
                                </div>
                                :
                                <p className='font-semibold'>Delivery Boy is not assigned yet</p>}
                        </> : <p className='text-green-600 font-semibold text-lg'>Delivered</p>}

                        {shopOrder.assignedDeliveryBoy && shopOrder.status != "delivered" &&
                            <div className="h-[400px] w-full rounded-2xl rounded-2xl overflow-hidden shadow-md">
                                <DeliveryBoyTracking data={{
                                    deliveryBoyLocation: { lat: shopOrder?.assignedDeliveryBoy?.location.coordinates?.[1], lon: shopOrder?.assignedDeliveryBoy?.location?.coordinates?.[0] },
                                    customerLocation: {
                                        lat: currentOrder?.deliveryAddress?.latitude,
                                        lon: currentOrder?.deliveryAddress?.longitude
                                    }
                                }} />
                            </div>
                        }

                    </div>
                )
            })}
        </div>
    )
}

export default TrackOrderPage