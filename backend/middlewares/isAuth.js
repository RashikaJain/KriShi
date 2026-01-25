import jwt from "jsonwebtoken"

export default async function isAuth(req, res, next) {
    try {
        const token = req.cookies.token;
        if(!token)
        {
            return res.status(400).json("cookie token not found");
        }

        //decode token
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);

        if(!decodedToken)
        {
            return res.status(400).json("Token is invalid");
        }

        req.userId = decodedToken.userId;

        return next();

    } catch (error) {
        return res.status(500).json({
            message: "User is not authenticated"
        })
    }
}


