import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = `./public/drivers/`;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb((err) => console.log(err), dest);
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
      (err) => console.log(err),
      id + "_" + Date.now() + "." + file.originalname.split(".").reverse()[0]
    );
  },
});

export default multer({ storage });
