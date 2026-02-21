import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"
import DeliveryAssignment from "../models/deliveryAssignment.model.js"
import { sendDeliveryOtpMail } from "../utils/mail.js";

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
                .populate("shopOrders.shopOrderItems.item", "name image price")
                .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")

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

        if (!order) {
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
        let deliveryBoysPayload = [];

        // as per shopOrder status
        if (status == "out for delivery" && !shopOrder.assignment) {
            const { longitude, latitude } = order.deliveryAddress;

            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates:
                                [Number(longitude),
                                Number(latitude)]
                        },
                        $maxDistance: 5000
                    }
                }
            })

            const nearByIds = nearByDeliveryBoys.map((deliveryBoy) => deliveryBoy._id);

            // to get the busy delivery Boys
            const busyIds = await DeliveryAssignment.find({
                assignedTo: {
                    $in: nearByIds
                },
                status: {
                    $nin: ["broadcasted", "completed"]
                }
            }).distinct("assignedTo")

            // removing the duplicate values using set
            const busyIdSet = new Set(busyIds.map(id => String(id)));

            // get the free boys
            const availableBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(String(b._id)));

            // send the delivery request 
            const candidates = availableBoys.map(b => b._id);

            if (candidates.length == 0) {
                await order.save();
                return res.json({
                    message: "order status updated but no available delivery boys"
                })
            }

            // creating delivery model
            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                broadcastedTo: candidates,
                status: "broadcasted"
            });

            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;

            shopOrder.assignment = deliveryAssignment._id;

            deliveryBoysPayload = availableBoys.map(b => ({
                id: b._id,
                name: b.fullName,
                longitude: b.location.coordinates?.[0],
                latitude: b.location.coordinates?.[1],
                mobile: b.mobile
            }))
        }


        await shopOrder.save();
        await order.save();

        const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId)

        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoy", "fullName email mobile")

        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoysPayload,
            assignment: updatedShopOrder?.assignment._id
        });
    }
    catch (error) {
        return res.status(500).json({
            message: `order status error, ${error}`
        })
    }
}

export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.userId;
        const assignments = await DeliveryAssignment.find({
            broadcastedTo: deliveryBoyId,
            status: "broadcasted",
        })
            .populate("order")
            .populate("shop");

        const formatted = assignments.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).shopOrderItems || [],
            subtotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId))?.subtotal,
        }))

        return res.status(200).json(formatted);
    }
    catch (error) {
        return res.status(500).json({
            message: `get assignment error:  ${error}`
        })
    }
}

export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await DeliveryAssignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({
                message: "No order to assign to delivery boy"
            })
        }

        if (assignment.status !== "broadcasted") {
            return res.status(400).json({
                message: "Assignment is expired"
            })
        }

        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["broadcasted", "completed"] }
        })

        if (alreadyAssigned) {
            return res.status(400).json({
                message: "You are already assigned to another order"
            })
        }

        assignment.assignedTo = req.userId;
        assignment.status = "assigned";
        assignment.acceptedAt = new Date();

        await assignment.save();

        // get the order 
        const order = await Order.findById(assignment.order)

        if (!order) {
            return res.status(400).json({
                message: "Order not found"
            })
        }

        const shopOrder = order.shopOrders.id(assignment.shopOrderId)

        if (shopOrder) {
            shopOrder.assignedDeliveryBoy = req.userId
        }

        await order.save();

        return res.status(200).json({
            message: "Order accepted"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: `accept order error ${error}`
        })
    }
}

export const getCurrentOrder = async (req, res) => {
    try {
        const assignment = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: "assigned"
        })
            .populate("shop", "name")
            .populate("assignedTo", "fullName email mobile location")
            .populate({
                path: "order",
                populate: [{ path: "user", select: " fullName email location mobile" }]
            })

        if (!assignment) {
            return res.status(404).json({
                message: "Error finding your order details"
            });
        }

        if (!assignment.order) {
            return res.status(404).json({
                message: "Error finding your assigned order"
            });
        }

        const shopOrder = await assignment.order.shopOrders.find(so => String(so._id) == String(assignment.shopOrderId))

        if (!shopOrder) {
            return res.status(404).json({
                message: "Error finding your shop Order"
            });
        }

        // we want delivery boy loation and latitude and longitude
        let deliveryBoyLocation = { lat: null, lon: null };

        if (assignment.assignedTo.location.coordinates.length == 2) {
            deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];

            deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
        }


        let customerLocation = { lat: null, lon: null };

        if (assignment.order.deliveryAddress) {
            customerLocation.lat = assignment.order.deliveryAddress.latitude
            customerLocation.lon = assignment.order.deliveryAddress.longitude

            console.log("delivery Address: ", customerLocation.lat, customerLocation.lon)
        }

        // return response
        return res.status(200).json({
            _id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAddress: assignment.order.deliveryAddress,
            deliveryBoyLocation,
            customerLocation
        })

    }
    catch (error) {
        return res.status(500).json({
            message: `Error in tracking the current order ${error}`
        })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrders.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoy",
                model: "User"
            })
            .populate({
                path: "shopOrders.shopOrderItems.item",
                model: "Item"
            })
            .lean();

        if (!order) {
            return res.status(400).json({
                message: `Sorry, but failed to find your order`
            })
        }

        console.log("your order is: ", order);
        return res.status(200).json(order);

    }
    catch (error) {
        return res.status(500).json({
            message: `Failed to track your orders with error : ${error}`
        })
    }
}

export const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body;
        const order = await Order.findById(orderId).populate("user");
        if (!order) {
            return res.status(400).json({
                message: "Error occured while sending the otp"
            })
        }

        const shopOrder = order.shopOrders.id(shopOrderId);

        if (!shopOrder) {
            return res.status(400).json({
                message: "Error occured while sending the otp"
            })
        }

        // creating otp
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        shopOrder.deliveryOtp = String(otp);
        shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;
        await order.save();

        // now send the mail to user
        await sendDeliveryOtpMail(order.user, otp);

        // sending the response 
        return res.status(200).json({
            message: `Otp is sent successfully to ${order.user.fullName}`
        })

    }
    catch (error) {
        return res.status(500).json({
            message: `Delivery OTP Verification error ${error}`
        })
    }
}

export const verifyDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body;
        const order = await Order.findById(orderId).populate("user");
        const shopOrder = order.shopOrders.id(shopOrderId);

        if (!order || !shopOrder) {
            return res.status(400).json({
                message: "Error occured while sending the otp"
            })
        }

        if (shopOrder.deliveryOtp !== String(otp) || shopOrder.otpExpires == null || shopOrder.otpExpires < Date.now()) {
            return res.status(404).json({
                message: "Error in verifying the otp"
            })
        }

        shopOrder.otpExpires = null;
        shopOrder.status = "delivered";
        shopOrder.deliveredAt = Date.now();
        await order.save();

        await DeliveryAssignment.deleteOne({
            shopOrderId: shopOrder._id,
            order: order._id,
            assignedTo: shopOrder.assignedDeliveryBoy
        })

        return res.status(200).json({
            message: "Order delivered successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            message: `Order Otp Error encountered: ${error}`
        })
    }
}

