import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from "axios"
import { serverUrl } from "../App"
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function EditItem() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [currentItem, setCurrentItem] = useState("");
    const { myShopData } = useSelector(state => state.owner);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0)
    const categories = ["Snacks", "Main Course", "Deserts", "Pizza", "Burgers", "Sandwiches", "South Indian", "North Indian", "Chinese", "Fast Food", "Others"]
    const [category, setCategory] = useState("");
    const [foodType, setFoodType] = useState("veg");
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null);
    const dispatch = useDispatch();
    const { itemId } = useParams();

    const handleImage = (e) => {
        const file = e.target.files[0];
        console.log("file: ", file);
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category);
            formData.append("foodType", foodType);
            formData.append("price", price);

            if (backendImage) {
                formData.append("image", backendImage);
            }

            const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, { withCredentials: true });

            console.log("result: ", result.data);
            dispatch(setMyShopData(result.data))
            console.log(myShopData);

            console.log("item", result);
            setLoading(false);
            navigate('/')
        }
        catch (err) {
            console.log("error occured while creating your shop ", err, " . Try again later!!")
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`,
                    { withCredentials: true }
                );

                setCurrentItem(result.data);

            }
            catch (err) {
                console.log(err);
            }
        })();
    }, [itemId])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(currentItem?.name || "")
        setPrice(currentItem?.price || 0);
        setCategory(currentItem?.category || "")
        setFrontendImage(currentItem?.image || null)
        setFoodType(currentItem?.foodType || "veg")

    }, [currentItem])

    return (
        <div className='overflow-hidden flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
            <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
                <IoMdArrowBack size={35} className='text-[#ff4d2d]' onClick={() => navigate('/')} />
            </div>

            {/* box */}
            <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
                <div className='flex flex-col items-center mb-6'>
                    {/* Icon of fork */}
                    <div className='bg-orange-100 p-4 rounded-full mb-4'>
                        <FaUtensils className='text-[#ff4d2d] w-16 h-16' />
                    </div>

                    {/* edit or create shop */}
                    <div className='text-3xl font-extrabold text-gray-900'>
                        Edit Food Item
                    </div>
                </div>


                {/* form for shop creation/edit */}
                <form className='space-y-5' onSubmit={handleSubmit}>

                    {/* Food Name */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                        <input type='text' placeholder='Enter Food Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-orange-500' onChange={(ev) => {
                            setName(ev.target.value)
                        }} value={name} />
                    </div>

                    {/* Picture of Shop */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                        <input type='file' accept='image/*' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-orange-500' onChange={handleImage} />

                        {frontendImage &&
                            <div className='mt-4'>
                                <img src={frontendImage} alt="img" className='w-full h-48 object-cover rounded-lg border' />
                            </div>
                        }
                    </div>

                    {/* Price */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Enter Price</label>
                        <input type='number' placeholder='0' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-orange-500' onChange={(ev) => {
                            setPrice(ev.target.value)
                        }} value={price} />
                    </div>

                    {/* Category */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
                        <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-orange-500' onChange={(ev) => {
                            setCategory(ev.target.value)
                        }} value={category}>
                            <option value="" disabled>Select Category</option>
                            {categories.map((cat, ind) => {
                                return <option value={cat} key={ind}>{cat}</option>
                            })}
                        </select>
                    </div>

                    {/* Veg or Non Veg */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food Type</label>
                        <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-orange-500' onChange={(ev) => {
                            setFoodType(ev.target.value)
                        }} value={foodType}>
                            <option value="veg">
                                Veg
                            </option>
                            <option value="non veg">Non-Veg</option>
                        </select>
                    </div>

                    {/* Button to Editor edit shop */}
                    <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg  transition-all duration-200 cursor-pointer' disabled={loading}>{loading ? <ClipLoader size={20} color='white' /> : "Save"}</button>
                </form>
            </div>
        </div>
    )
}

export default EditItem