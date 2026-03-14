import multer from 'multer';
import {
  PROFILE_PHOTO_ALLOWED_MIME_TYPES,
  PROFILE_PHOTO_MAX_FILE_SIZE
} from '../validation/authValidation.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image uploads are allowed'));
    return;
  }
  if (!PROFILE_PHOTO_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error('Only JPEG and PNG images are allowed'));
    return;
  }
  cb(null, true);
};

export const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: PROFILE_PHOTO_MAX_FILE_SIZE },
  fileFilter
});
