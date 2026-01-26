import express from "express"
import { upload } from "../middlewares/multer.js"
import { addItem, deleteItem, editItem, getItemById } from "../controllers/item.controllers.js"
import isAuth from "../middlewares/isAuth.js";

const itemRouter = express.Router();

// routers
itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem)
itemRouter.get('/get-by-id/:itemId', isAuth, getItemById);
itemRouter.get('/delete/:itemId', isAuth,deleteItem)

export default itemRouter;


