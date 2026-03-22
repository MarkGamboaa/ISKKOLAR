import React from "react";
import Modal from "./Modal";
import Button from "./Button";

const DocumentViewerModal = ({ isOpen, onClose, documentUrl, fileName, documentType, mimeType }) => {
  if (!documentUrl) return null;

  const isDocx = mimeType?.includes('wordprocessingml') || fileName?.match(/\.(doc|docx)$/i);
  const isPdf = mimeType?.includes('pdf') || fileName?.match(/\.pdf$/i);

  let viewerUrl = documentUrl;
  if (isDocx) {
    viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documentUrl)}`;
  } else if (isPdf) {
    viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(documentUrl)}&embedded=true`;
  }

  const formattedType = documentType 
    ? documentType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Document';
    
  const modalTitle = fileName ? `${formattedType} - ${fileName}` : formattedType;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="lg">
      <div className="flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden min-h-[60vh] relative">
        <iframe src={viewerUrl} title={fileName} className="w-full h-[70vh] border-0 bg-white" />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm flex items-center justify-center">
          Download / Open
        </a>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default DocumentViewerModal;
