import express from "express"
import { acceptOrder, getCurrentOrder, getDeliveryBoyAssignment, getMyOrders, getOrderById, placeOrder, sendDeliveryOtp, updateOrderStatus, verifyDeliveryOtp } from "../controllers/order.controllers.js"
import isAuth from "../middlewares/isAuth.js";
const orderRouter = express.Router();

// routers
orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.post("/send-delivery-otp", isAuth, sendDeliveryOtp);
orderRouter.post("/verify-delivery-otp", isAuth,verifyDeliveryOtp);
orderRouter.get("/my-orders", isAuth, getMyOrders);
orderRouter.get("/get-assignments", isAuth, getDeliveryBoyAssignment);
orderRouter.get("/get-current-order", isAuth, getCurrentOrder);
orderRouter.get("/accept-order/:assignmentId", isAuth, acceptOrder);
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRouter.get("/get-order-by-id/:orderId", isAuth, getOrderById);


export default orderRouter;


