import mongoose from "mongoose"

const {Schema} = mongoose 

const shopSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    image:{
        type: String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    city:{
        type: String,
        required:true
    },
    state:{
        type: String,
        requires:true
    },
    address:{
        type: String,
        required: true
    },
    items:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    }]

    // using the mongoose.Schema.Types,ObjectId => it's like a foreign key referencing to the table User
},{timestamps:true})

const Shop = mongoose.model("Shop",shopSchema);

export default Shop;