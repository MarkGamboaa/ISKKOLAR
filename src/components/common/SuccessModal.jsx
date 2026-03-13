import Modal from "./Modal";
import Button from "./Button";

const SuccessModal = ({ isOpen, onClose, title = "Success!", message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-4">
        <div className="mx-auto w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center mb-4 animate-bounce-in">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <Button onClick={onClose} fullWidth>
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
