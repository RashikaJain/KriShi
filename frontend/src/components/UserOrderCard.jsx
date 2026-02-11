import React from 'react'

function UserOrderCard({ data }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }
  return (
    <div className='bg-white rounded-lg shadow-lg space-y-4'>
      <div className='flex justify-between border-b pb-2 '>

        {/* Left Div */}
        <div>
          <p className='font-semibold'>
            order #{data._id.slice(-6)}
          </p>
          <p className='text-sm text-gray-500'>
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        {/* Right Div */}
        <div className='text-right'>
          <p className='text-sm text-gray-500'>{data.paymentMethod.toUpperCase()}</p>
          <p className='font-medium text-blue-500 '>{data.shopOrders[0].status}</p>
        </div>

      </div>

      {/* Shop Orders */}

      {data.shopOrders.map((shopOrder, index) => {
        return (
          <div key={index} className='border rounded-lg p-3 bg-[#fffaf7] space-y-3'>
            <p>{shopOrder.shop.name}</p>

            {/* Image Mapping */}
            <div className='flex space-x-4 overflow-x-auto pb-2'>
              {shopOrder.shopOrderItems.map((item, index) => {
                return (
                  <div key={index} className='shrink-0 w-40 border rounded-lg p-2 bg-white '>
                    <img src={item.item.image} alt={item.item.name} className='w-full h-24 object-cover rounded' />
                    <p className='text-sm font-semibold mt-1'>{item.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}x₹{item.price}</p>

                  </div>
                )
              })}

            </div>

            {/* Total Price */}
            <div className="flex  justify-between items-center border-t pt-2">
              <p className='font-semibold'>SubTotal: {shopOrder.subtotal}</p>
              <span className='text-sm font-medium text-blue-500'> {shopOrder.status}</span>
            </div>

          </div>
        )
      })}

      <div className='flex justify-between items-center border-t pb-2 pt-2'>
        <p className='font-semibold '>Total: ₹{data.totalAmount}</p>
        <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm'>Track Order</button>
      </div>

    </div>
  )
}

export default UserOrderCard