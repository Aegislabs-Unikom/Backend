import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//  Local storage
const upload = multer({ 
  storage : storage,
  fileFilter: checkFileType,
  limits: { fileSize: 1024 * 1024 * 5 }});


//  Google Bucket
const multerUploads = multer({
  storage: multer.memoryStorage(),
  fileFilter: checkFileType,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});



function checkFileType(req: any, file: any, callback: any) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (extName && mimeType) {
    return callback(null, true);
  } else {
    callback('Error: Images Only!');
  }
}

export default multerUploads;
