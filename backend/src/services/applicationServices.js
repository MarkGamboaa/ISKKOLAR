import { uploadDocument } from './storageServices.js';

/**
 * Generic helper to upload all documents and build insert rows
 * @param {Object} uploadedFiles - multer files object
 * @param {string} applicationId - application ID to attach docs to
 * @param {Array<string>} requiredDocTypes - list of required doc type names
 * @param {Array<string>} optionalDocTypes - list of optional doc type names
 * @returns {Promise<Array>} array of document insert rows
 */
export const uploadAllDocuments = async (
  uploadedFiles,
  applicationId,
  requiredDocTypes,
  optionalDocTypes = []
) => {
  const allDocTypes = [...requiredDocTypes, ...optionalDocTypes];
  const inserts = [];

  for (const docType of allDocTypes) {
    const fileArr = uploadedFiles[docType];
    if (!fileArr || !fileArr[0]) continue;

    const file = fileArr[0];
    const filePath = await uploadDocument(file, applicationId, docType);

    inserts.push({
      application_id: applicationId,
      document_type: docType,
      file_path: filePath,
      file_name: file.originalname,
      file_size: file.size,
      mime_type: file.mimetype,
      is_required: requiredDocTypes.includes(docType),
    });
  }

  return inserts;
};
