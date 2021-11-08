import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id =
      req.body.id ||
      req.body.name
        .trim()
        .split(" ")
        .map((v) => v.toLowerCase())
        .join("_");
    const dest = `./public/images/${id}/`;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const id =
      req.body.id ||
      req.body.name
        .trim()
        .split(" ")
        .map((v) => v.toLowerCase())
        .join("_");
    cb(
      null,
      id + "_" + Date.now() + "." + file.originalname.split(".").reverse()[0]
    );
  },
});

export default multer({ storage });
