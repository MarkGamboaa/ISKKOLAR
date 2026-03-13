import { useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import SuccessModal from "../../components/common/SuccessModal";
import * as authService from "../../services/authService";

const STEPS = [
  { label: "Account Setup", key: "account" },
  { label: "Personal Details", key: "personal" },
  { label: "Scholarship Info", key: "scholarship" },
  { label: "Review & Submit", key: "review" },
];

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  userType: "applicant",
  scholarshipType: "Tertiary",
  agreeTerms: false,
};

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateStep = (step) => {
    const errs = {};
    if (step === 0) {
      if (!form.email.trim()) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
      if (!form.password) errs.password = "Password is required";
      else if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
      if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
      else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    }
    if (step === 1) {
      if (!form.firstName.trim()) errs.firstName = "First name is required";
      if (!form.lastName.trim()) errs.lastName = "Last name is required";
    }
    if (step === 3) {
      if (!form.agreeTerms) errs.agreeTerms = "You must agree to the Terms and Conditions";
    }
    return errs;
  };

  const handleBlur = (field) => {
    const errs = validateStep(currentStep);
    setErrors((prev) => ({ ...prev, [field]: errs[field] || undefined }));
  };

  const handleNext = () => {
    const errs = validateStep(currentStep);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    const errs = validateStep(3);
    setErrors(errs);
    setApiError("");
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await authService.register(form);
      setShowSuccess(true);
      handleClose();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ ...initialForm });
    setErrors({});
    setApiError("");
    setCurrentStep(0);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        {/* Header */}
        <div className="mb-6">
          {currentStep > 0 && (
            <button onClick={handleBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-3 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>
          )}
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Join ISKKOLAR today</p>
        </div>

        {/* Stepper */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((step, i) => (
            <div
              key={step.key}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step label */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h3 className="text-lg font-bold text-primary">{STEPS[currentStep].label}</h3>
          </div>
          <p className="text-sm text-gray-500 ml-3">
            {currentStep === 0 && "Create your login credentials"}
            {currentStep === 1 && "Provide your personal details"}
            {currentStep === 2 && "Select your scholarship preferences"}
            {currentStep === 3 && "Review your information and submit"}
          </p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-danger-light text-danger text-sm rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {apiError}
          </div>
        )}

        {/* Step 0: Account Setup */}
        {currentStep === 0 && (
          <div>
            <Input
              label="Email"
              name="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              error={errors.email}
              placeholder="Email"
              required
              icon={
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              }
            />
            <p className="text-xs text-gray-400 -mt-3 mb-4 ml-1">We'll use this to verify your account</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Password"
                name="reg-password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                error={errors.password}
                placeholder="••••••••"
                required
              />
              <PasswordInput
                label="Confirm Password"
                name="reg-confirm-password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                placeholder="••••••••"
                required
              />
            </div>
            <p className="text-xs text-gray-400 -mt-3 mb-4 ml-1">Use 8+ characters with mix of letters, numbers & symbols</p>
          </div>
        )}

        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="reg-firstName"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                error={errors.firstName}
                placeholder="Enter First Name"
                required
              />
              <Input
                label="Last Name"
                name="reg-lastName"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                error={errors.lastName}
                placeholder="Last Name"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Scholarship Info */}
        {currentStep === 2 && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am registering as <span className="text-danger">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["applicant", "scholar"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField("userType", type)}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                      form.userType === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{type === "applicant" ? "📝" : "🎓"}</div>
                    <div className="text-sm font-medium capitalize">{type}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="reg-scholarshipType" className="block text-sm font-medium text-gray-700 mb-1.5">
                Scholarship Type <span className="text-danger">*</span>
              </label>
              <select
                id="reg-scholarshipType"
                value={form.scholarshipType}
                onChange={(e) => updateField("scholarshipType", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="Tertiary">Tertiary Education Scholarship</option>
                <option value="Vocational">Vocational Training Scholarship</option>
                <option value="SDEA">SDEA (Socially Disadvantaged Educational Assistance)</option>
                <option value="Board Exam Assistance">Board Exam Assistance</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{form.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Full Name</span>
                <span className="font-medium text-gray-900">{form.firstName} {form.lastName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Registering As</span>
                <span className="font-medium text-gray-900 capitalize">{form.userType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Scholarship Type</span>
                <span className="font-medium text-gray-900">{form.scholarshipType}</span>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => updateField("agreeTerms", e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                I agree to the{" "}
                <a href="#" className="text-primary hover:text-primary-light font-medium">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:text-primary-light font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="mt-1 text-xs text-danger flex items-center gap-1 ml-7">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.agreeTerms}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8">
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} fullWidth size="lg">
              Next Step →
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading} fullWidth size="lg">
              Create Account
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => {
              handleClose();
              onSwitchToLogin();
            }}
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            Login here
          </button>
        </p>
      </Modal>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Success!"
        message="We sent a verification link to your email"
      />
    </>
  );
};

export default RegisterModal;
