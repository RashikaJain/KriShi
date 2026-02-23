import Item from "../models/item.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";

export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body;
        let image;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const shop = await Shop.findOne({ owner: req.userId });

        if (!shop) {
            return res.status(400).json({ message: "shop not found" });
        }

        const item = await Item.create({
            name,
            category,
            foodType,
            price,
            image,
            shop: shop._id,
        });

        // Only update items array
        await Shop.findByIdAndUpdate(
            shop._id,
            { $push: { items: item._id } },
            { new: true }
        );

        const updatedShop = await Shop.findById(shop._id).populate("owner").populate({
            path: "items",
            options: {
                sort: { updatedAt: -1 }
            }
        });

        return res.status(200).json(updatedShop);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Add item error : ${error}`,
        });
    }
};

export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const { name, category, foodType, price } = req.body;
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const item = await Item.findByIdAndUpdate(itemId, {
            name, category, foodType, price, image
        }, { new: true });

        if (!item) {
            return res.status(400).json({
                message: `Item not found`
            })
        }

        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "items",
            options: {
                sort: { updatedAt: -1 }
            }
        });

        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json({
            message: `edit item error : ${error}`
        })
    }
}

export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(400).json("can not find the item, try again later");
        }

        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({
            message: `item not found error: ${error}`
        })
    }
}

// export const deleteItem = async (req, res) => {
//     try {
//         const itemId = req.params.itemId;
//         const item = await Item.findByIdAndDelete(itemId);
//         if (!item) {
//             return res.status(400).json({
//                 message: "item not found"
//             })
//         }

//         const shop = await Shop.findOne({ owner: req.userId });
//         shop.items = shop.items.filter(i => i !== item._id)
//         await shop.save();
//         await shop.populate({
//             path:"items",
//             options:{
//                 sort:{updatedAt:-1}
//             }
//         })

//         return res.status(200).json(shop);
//     }
//     catch (error) {
//         return res.status(500).json({
//             message: `delete item error ${error}`
//         })
//     }
// }

export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        const item = await Item.findByIdAndDelete(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const updatedShop = await Shop.findOneAndUpdate(
            { owner: req.userId },
            { $pull: { items: itemId } },
            { new: true }
        ).populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        });

        if (!updatedShop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        return res.status(200).json(updatedShop);

    } catch (error) {
        console.error("DELETE ITEM ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getItemsByCity = async (req,res)=>{
    try{
        const {city} =  req.params;
        console.log("city got as :  " ,city )
        if(!city)
        {
            return res.status(400).json({message: "City is required"});
        }

        const shops =  await Shop.find({
            city:{$regex: new RegExp(`^${city}$`,"i")}
        }).populate("items");

        if(shops.length === 0)
        {
            console.log("error in shop finding")
            return res.status(400).json({message:"Shop for the city not found"});
        }

        const shopIds = shops.map((shop,ind)=>shop._id);

        // as the shop are stored using their ids only 
        const items = await Item.find({
            shop:{
                $in:shopIds
            }
        })

        console.log(items, ", error in items finding");

        return res.status(200).json(items);
    }
    catch(error)
    {
        return res.status(500).json({
            message: `Items as per city controller not found, ${error}`
        })
    }
}

export const getItemsByShop = async (req,res)  => {
    try
    {
        const {shopId} = req.params;
        const shop = await Shop.findById(shopId).populate("items");

        if(!shop)
        {
            return res.status(400).json("shop not found");
        }

        return res.status(200).json({shop,items:shop.items});
    }
    catch(error)
    {
        return res.status(500).json({
            message: "Errors in finding the items using the shop"
        })
    }
}
