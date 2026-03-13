import multer from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image uploads are allowed'));
    return;
  }

  cb(null, true);
};

export const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});
