import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice.js"
import ownerSlice from "./ownerSlice.js"

export const store= configureStore({
    //contains all the slices here 
    reducer:{
        user: userSlice,
        owner: ownerSlice
    }
})