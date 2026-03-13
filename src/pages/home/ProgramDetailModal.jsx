import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

const ProgramDetailModal = ({ isOpen, onClose, program, onApplyClick }) => {
  if (!program) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={program.name} size="lg">
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">About This Program</h4>
          <p className="text-gray-600 leading-relaxed">{program.description}</p>
        </div>

        {/* Eligibility */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Eligibility</h4>
          <p className="text-gray-600 leading-relaxed">{program.eligibility}</p>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Requirements</h4>
          <ul className="space-y-2">
            {program.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600">
                <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Benefits</h4>
          <ul className="space-y-2">
            {program.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600">
                <svg className="w-5 h-5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Apply Button */}
        <div className="pt-2">
          <Button onClick={onApplyClick} fullWidth size="lg">
            Apply Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProgramDetailModal;
