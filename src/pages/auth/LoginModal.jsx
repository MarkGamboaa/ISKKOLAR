import { useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleBlur = (field) => {
    const errs = validate();
    setErrors((prev) => ({ ...prev, [field]: errs[field] || undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setApiError("");
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      onClose();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ email: "", password: "" });
    setErrors({});
    setApiError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Welcome Back" size="sm">
      <p className="text-sm text-gray-500 mb-6">Please enter your details to sign in</p>

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
          name="login-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          placeholder="Enter your email"
          required
          icon={
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          }
        />

        <PasswordInput
          label="Password"
          name="login-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          placeholder="Enter your password"
          required
        />

        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => {
              handleClose();
              onSwitchToForgotPassword();
            }}
            className="text-sm text-primary hover:text-primary-light font-medium transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Login
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{" "}
        <button
          onClick={() => {
            handleClose();
            onSwitchToRegister();
          }}
          className="text-primary hover:text-primary-light font-medium transition-colors"
        >
          Create Account
        </button>
      </p>
    </Modal>
  );
};

export default LoginModal;
