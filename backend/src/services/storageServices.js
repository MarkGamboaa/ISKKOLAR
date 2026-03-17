import { supabaseAdmin as supabase } from '../config/supabase.js';

const SCHOLARSHIP_DOCS_BUCKET = 'scholarship-documents';

const resolveContentType = (file) => {
  const mime = (file.mimetype || '').toLowerCase();
  const ext = (file.originalname?.split('.').pop() || '').toLowerCase();

  if (mime === 'application/pdf' || mime === 'application/x-pdf' || mime === 'application/acrobat' || ext === 'pdf') {
    return 'application/pdf';
  }

  if (mime === 'application/msword' || mime === 'application/vnd.ms-word' || ext === 'doc') {
    return 'application/msword';
  }

  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  return file.mimetype;
};

const ensureDocsBucket = async () => {
  const { data: existingBucket, error: getBucketError } = await supabase.storage.getBucket(SCHOLARSHIP_DOCS_BUCKET);

  if (!getBucketError && existingBucket) {
    return;
  }

  const { error: createBucketError } = await supabase.storage.createBucket(SCHOLARSHIP_DOCS_BUCKET, {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  });

  if (createBucketError && !createBucketError.message?.toLowerCase().includes('already exists')) {
    throw new Error(`Storage bucket setup failed: ${createBucketError.message}`);
  }
};

/**
 * Upload a single file buffer to Supabase Storage
 * @param {Express.Multer.File} file
 * @param {string} applicationId
 * @param {string} documentType
 * @returns {Promise<string>} filePath in storage
 */
export const uploadDocument = async (file, applicationId, documentType) => {
  await ensureDocsBucket();

  const ext = file.originalname.split('.').pop();
  const filePath = `applications/${applicationId}/${documentType}_${Date.now()}.${ext}`;
  const contentType = resolveContentType(file);

  const { error } = await supabase.storage
    .from(SCHOLARSHIP_DOCS_BUCKET)
    .upload(filePath, file.buffer, {
      contentType,
      upsert: false,
    });

  if (error) throw new Error(`Storage upload failed [${documentType}]: ${error.message}`);
  return filePath;
};
