import express from "express"
import { getCurrentUser, updateUserLocation } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js"

const userRouter = express.Router();

// routers
userRouter.get("/current",isAuth,getCurrentUser);
userRouter.post("/update-location", isAuth, updateUserLocation)

export default userRouter;


