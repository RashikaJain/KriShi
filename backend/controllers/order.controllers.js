import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"

export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

        if (cartItems.length == 0 || !cartItems) {
            return res.status(400).json({
                message: "Cart is empty"
            })
        }

        if (!deliveryAddress?.text || !deliveryAddress?.longitude ||
            !deliveryAddress.latitude
        ) {
            return res.status(400).json({
                message: "Delivery Address not found"
            })
        }

        // find the shop    
        const groupItemsByShop = {};
        cartItems.forEach(item => {
            const shopId = item.shop;
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = [];
            }

            groupItemsByShop[shopId].push(item);
        })

        // creating a shop Order
        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId).populate("owner");

            if (!shop) {
                return res.status(400).json({
                    message: "Shop not found"
                })
            }

            const items = groupItemsByShop[shopId];

            // sub total 
            const subtotal = items.reduce((sum, i) => sum + (((Number)(i.price)) * ((Number)(i.quantity))), 0)

            return {
                shop: shop._id,
                owner: shop.owner._id,
                subtotal,
                shopOrderItems: items.map(i => {
                    return {
                        item: i.id,
                        price: i.price,
                        quantity: i.quantity,
                        name: i.name
                    }
                })
            }
        }))

        // creating order  
        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        })

        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price");

        await newOrder.populate("shopOrders.shop", "name")

        return res.status(201).json(newOrder)

    } catch (error) {
        return res.status(500).json({
            message: "Place order error", error
        })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({
                message: "No user found while placing the order"
            })
        }
        if (user.role == 'user') {
            const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 }).populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price");

            console.log("user orders", orders);

            return res.status(200).json(orders);
        }

        else if (user.role == 'owner') {
            const orders = await Order.find({ "shopOrders.owner": req.userId }).sort({ createdAt: -1 }).populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name image price");

            console.log("owner orders: ", orders);

            const filteredOrder = orders.map((order) => {
                return {
                    id: order._id,
                    paymentMethod: order.paymentMethod,
                    deliveryAddress: order.deliveryAddress,
                    user: order.user,
                    shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                    createdAt: order.createdAt
                }
            });

            return res.status(200).json(filteredOrder);
        }

    }
    catch (error) {
        return res.status(500).json({
            message: "Get Order error: ", error
        })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);

        if(!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const shopOrder = order.shopOrders.find(o => o.shop == shopId);

        if (!shopOrder) {
            return res.status(404).json({
                message: "shop order not found"
            })
        }

        shopOrder.status = status;
        await shopOrder.save();
        await order.save();

        return res.status(200).json(shopOrder.status);
    }
    catch (error) {
        return res.status(500).json({
            message: `order status error, ${error}`
        })
    }
}
