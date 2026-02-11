import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 8080;

const app = express();

// cors and configuration

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
)) // development mode only


// to call routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter);

app.listen(port, () => {
    connectDB();
    console.log(`server is listening on http/localhost:${port}`);
})
