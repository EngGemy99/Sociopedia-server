import multer from "multer";
import { v4 as uuidv4 } from "uuid";
const fileUpload = (fieldName) => {
  //! this part responsible for save image in local folder
  //?i remove it to save on cloudinary
  //? but let that to raise photo in req only
  const storage = multer.diskStorage({});
  //  ! to filter data
  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Upload Image Only 🙄", false);
    }
  }
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 },
  });
  //? single to publish one photo
  return upload.single(fieldName);
};
export { fileUpload };
//? fieldName refer to field input name in html
