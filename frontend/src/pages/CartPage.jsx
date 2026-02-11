import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import CarditemCard from '../components/CarditemCard.jsx';

function CartPage() {
    const navigate = useNavigate();
    const { cartItems, totalAmount } = useSelector(state => state.user)
    return (
        <div className='min-h-screen bg-[#fff9f6] flex justify-center p-6'>
            <div className='w-full   max-w-[800px]'>


                {/* Top items like back icon */}
                <div className='flex  items-center items-center justify-center gap-[20px] mb-6 '>
                    <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
                        <IoMdArrowBack size={35} className='text-[#ff4d2d]' onClick={() => navigate('/')} />
                    </div>

                    <h1 className='text-2xl  font-bold text-start'>Your Cart</h1>
                </div>

                {cartItems?.length == 0 ? (
                    <p className='text-gray-500 text-lg text-center'>Your Cart is empty</p>
                ) : (
                    <>
                        <div className='space-y-4'>
                            {cartItems.map((item) => {
                                return <CarditemCard data={item} key={item.id} />
                            })}
                        </div>
                        <div className='mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border'>
                            <h1 className='text-lg font-semibold'>
                                Total Amount
                            </h1>
                            <span className='text-xl font-bold text-[#ff4d2d]'>₹{totalAmount}</span>
                        </div>
                        <div className='mt-4 flex justify-end'>
                            <button className='bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64526] transition cursor-pointer' onClick={()=>navigate('/checkout')}>
                                Proceed to CheckOut
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CartPage