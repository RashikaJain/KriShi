import express from "express"
import { upload } from "../middlewares/multer.js"
import { createEditShop, getMyShop, getShopByCity } from "../controllers/shop.controllers.js"
import isAuth from "../middlewares/isAuth.js";

const shopRouter = express.Router();

// routers
shopRouter.post("/create-edit",isAuth,upload.single("image"),createEditShop);
shopRouter.get("/get-my",isAuth,getMyShop)
shopRouter.get("/get-by-city/:city",isAuth,getShopByCity)

export default shopRouter;


