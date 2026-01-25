import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(process.cwd(), "public"));
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

export const upload = multer({ storage });
