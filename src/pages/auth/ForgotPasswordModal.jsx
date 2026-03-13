import { useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import SuccessModal from "../../components/common/SuccessModal";
import * as authService from "../../services/authService";

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setApiError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setShowSuccess(true);
      handleClose();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setApiError("");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Forgot Password" size="sm">
        <p className="text-sm text-gray-500 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {apiError && (
          <div className="mb-4 p-3 bg-danger-light text-danger text-sm rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            name="forgot-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onBlur={() => { if (!email.trim()) setError("Email is required"); else if (!/\S+@\S+\.\S+/.test(email)) setError("Invalid email format"); }}
            error={error}
            placeholder="Enter your email"
            required
            icon={
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />

          <Button type="submit" loading={loading} fullWidth size="lg">
            Send Reset Link
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <button
            onClick={() => {
              handleClose();
              onSwitchToLogin();
            }}
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            ← Back to Login
          </button>
        </p>
      </Modal>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Reset Link Sent"
        message="A password reset link has been sent to your email address."
      />
    </>
  );
};

export default ForgotPasswordModal;
