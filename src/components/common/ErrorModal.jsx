import Modal from "./Modal";
import Button from "./Button";

const ErrorModal = ({ isOpen, onClose, title = "Error", message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-danger-light flex items-center justify-center mb-4 animate-bounce-in">
          <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-danger mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <Button variant="danger" onClick={onClose} fullWidth>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
