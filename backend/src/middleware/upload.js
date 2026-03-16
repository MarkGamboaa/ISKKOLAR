import multer from 'multer';
import path from 'path';
import {
  PROFILE_PHOTO_ALLOWED_MIME_TYPES,
  PROFILE_PHOTO_MAX_FILE_SIZE
} from '../validation/authValidation.js';
import {
  ALLOWED_DOC_MIME_TYPES,
  MAX_DOC_FILE_SIZE
} from '../validation/scholarshipValidation.js';

const storage = multer.memoryStorage();

const ALLOWED_DOC_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);
const ALLOWED_DOC_MIME_TYPES_SET = new Set([
  ...ALLOWED_DOC_MIME_TYPES,
  'application/x-pdf',
  'application/acrobat',
]);

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

const docFileFilter = (req, file, cb) => {
  const fileMime = (file.mimetype || '').toLowerCase();
  const fileExt = path.extname(file.originalname || '').toLowerCase();

  const validByMime = ALLOWED_DOC_MIME_TYPES_SET.has(fileMime);
  const validByExt = ALLOWED_DOC_EXTENSIONS.has(fileExt);

  if (!validByMime && !validByExt) {
    return cb(
      new Error(
        `Invalid file type for ${file.fieldname}: received "${file.mimetype || 'unknown'}". Allowed formats are PDF (.pdf), JPEG (.jpg/.jpeg), and PNG (.png).`
      )
    );
  }

  cb(null, true);
};

export const uploadTertiaryDocs = multer({
  storage,
  limits: { fileSize: MAX_DOC_FILE_SIZE },
  fileFilter: docFileFilter,
}).fields([
  { name: 'grade_report', maxCount: 1 },
  { name: 'cor', maxCount: 1 },
  { name: 'current_term_report', maxCount: 1 },
  { name: 'certificate_of_indigency', maxCount: 1 },
  { name: 'birth_certificate', maxCount: 1 },
  { name: 'income_cert_father', maxCount: 1 },
  { name: 'income_cert_mother', maxCount: 1 },
  { name: 'essay', maxCount: 1 },
  { name: 'recommendation_letter', maxCount: 1 }, // optional
]);