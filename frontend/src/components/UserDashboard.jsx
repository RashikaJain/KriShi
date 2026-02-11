import React, { useEffect, useRef, useState } from 'react'
import Nav from "./Nav.jsx"
import { categories } from '../category.js'
import CategoryCard from './CategoryCard.jsx'
import { FaCircleChevronLeft } from 'react-icons/fa6'
import { FaCircleChevronRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import FoodCard from './FoodCard.jsx'

function UserDashboard() {
    const { currentCity, shopInMyCity, itemsInMyCity } = useSelector(state => state.user)
    const [showLeftCateButton, setShowLeftCateButton] = useState(false);
    const [showRightCateButton, setShowRightCateButton] = useState(false);
    const [showLeftShopButton, setShowLeftShopButton] = useState(false);
    const [showRightShopButton, setShowRightShopButton] = useState(false);
    const cateScrollRef = useRef();
    const shopScrollRef = useRef();
    const scrollHandler = (ref, direction) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction == "left" ? -200 : 200,
                behavior: "smooth"
            })
        }
    }

    const updateButton = (ref, setLeftButton, setRightButton) => {
        const element = ref.current
        if (element) {
            setLeftButton(element.scrollLeft > 0);
            setRightButton((element.scrollLeft + element.clientWidth) < element.scrollWidth)
        }
    }

    useEffect(() => {
        if (cateScrollRef.current) {
            updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
            cateScrollRef.current.addEventListener("scroll", () => {
                updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
            })
        }

        if (shopScrollRef.current) {
            updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
            shopScrollRef.current.addEventListener("scroll", () => {
                updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
            })
        }

        return () => {
            if (cateScrollRef.current)
                cateScrollRef.current.removeEventListener("scroll", () => {
                    updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
                })

            if (shopScrollRef.current)
                shopScrollRef.current.removeEventListener("scroll", () => {
                    updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
                })
        }

    }, [categories])

    return (
        <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
            <Nav />

            <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>

                <h1 className='text-gray-800 text-2xl sm:text-3xl '>Inspiration for  your first order</h1>
                {/* Button and container for varieties of items  */}
                <div className='w-full relative'>
                    {showLeftCateButton &&
                        <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528]  z-10' onClick={() => scrollHandler(cateScrollRef, "left")} >

                            <FaCircleChevronLeft />
                        </button>}
                    <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={cateScrollRef}>
                        {categories.map((cate, ind) => {
                            return <CategoryCard name={cate.category} image={cate.image} key={ind} />
                        })}
                    </div>
                    {showRightCateButton &&
                        <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528]  z-10' onClick={() => scrollHandler(cateScrollRef, "right")}>
                            <FaCircleChevronRight />
                        </button>}
                </div>

                {/* Famous Shops */}
                <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
                    <h1 className='text-gray-800 text-2xl sm:text-3xl '>Best Shop in {currentCity}</h1>

                    <div className='w-full relative'>
                        {showLeftShopButton &&
                            <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528]  z-10' onClick={() => scrollHandler(shopScrollRef, "left")} >

                                <FaCircleChevronLeft />
                            </button>}
                        <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={shopScrollRef}>
                            {shopInMyCity?.map((shop, ind) => {
                                return <CategoryCard name={shop.name || "Name not defined"} image={shop.image} key={ind} />
                            })}
                        </div>
                        {showRightShopButton &&
                            <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528]  z-10' onClick={() => scrollHandler(shopScrollRef, "right")}>
                                <FaCircleChevronRight />
                            </button>}
                    </div>

                </div>

                {/* Famous Food Items */}
                <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
                    <h1 className='text-gray-800 text-2xl sm:text-3xl '>Suggested Food Items</h1>

                    <div className='w-full h--auto flex flex-wrap gap-[20px] justify-center'>
                        {itemsInMyCity?.map((item, ind) => {
                            return <FoodCard key={ind} data={item} />
                        })}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default UserDashboard