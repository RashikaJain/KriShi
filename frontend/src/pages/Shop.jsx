/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaLocationDot, FaStore, FaUtensils } from "react-icons/fa6"
import { } from "react-icons/fa"
import FoodCard from '../components/FoodCard'


function Shop() {
    const navigate = useNavigate();
    const { shopId } = useParams();
    const [items, setItems] = useState([]);
    const [shop, setShop] = useState([]);
    const handleShop = async () => {
        try {
            const result = await axios(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true });

            setShop(result.data.shop);
            setItems(result.data.items)
        }
        catch (error) {
            console.log("error finding items  for the shop: ", error)
        }
    }

    useEffect(() => {
        handleShop();
    }, [shopId])


    return (
        <div className='min-h-screen bg-gray-50'>


            {/* Go back */}
            <button className='absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow transition' onClick={() => { navigate('/') }}>
                <FaArrowLeft />
                <span>Back</span>
            </button>

            {shop &&
                <div className='relative w-full h-64 md:h-80 lg:h-96'>
                    <img src={shop.image} alt="" className='w-full h-full object-cover' />

                    {/* To show the shop details */}
                    <div className='absolute inset-0 bg-gradient-to-b from-black/70 to-black-30 flex flex-col justify-center items-center text-center px-4'>

                        {/* Shop Details */}
                        <FaStore className='text-white text-4xl mb-3 drop-shadow-md' />
                        <h1 className='text-3xl  md:text-5xl font-extrabold text-white drop-shadow-lg'>{shop.name}</h1>

                        <div className='flex  items-center justify-center gap-[10px]'>
                            <FaLocationDot color='red' size={22} />
                            <p className="text-lg font-medium text-gray-200 mt-[10px]">
                                {shop.address}
                            </p>
                        </div>
                    </div>

                    {/* Items div */}
                    <div className='max-w-7xl mx-auto px-6 py-10'>
                        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800">
                            <FaUtensils color='red' size={30} />
                            Our Menu</h2>

                        {/* mapping all the items */}
                        {items.length > 0 ? (
                            <div className="flex flex-wrap justify-center gap-8">
                                {items.map(i => (
                                    <FoodCard data={i} />
                                ))}
                            </div>
                        ) : <p className='text-center text-gary-500 text-lg'>No items available at the moment</p>}
                    </div>

                </div>
            }
        </div>
    )
}

export default Shop