import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(request, file, cb) {
    cb(null, "uploads/");
  },
  filename(request, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("images Only");
  }
}

const upload = multer({
  storage,
  fileFilter: function (request, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (request, response) => {
  response.send(`/${request.file.path}`);
});

export default router;
