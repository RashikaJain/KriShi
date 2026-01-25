import User from  "../models/user.model.js"

export const getCurrentUser = async (req,res) => {
    try{
        const userId = req.userId;

        if(!userId)
        {
            return res.status(400).json("userId for the current user is not found");
        }

        // does the user exist in database 
        const user = await User.findById(userId);

        if(!user)
        {
            return res.status(400).json("user does not exist in the database");
        }

        return res.status(200).json(user)
    }
    catch(error)
    {
        return res.status(500).json({
            message: `get current user error ${error}`
        });
    }
}