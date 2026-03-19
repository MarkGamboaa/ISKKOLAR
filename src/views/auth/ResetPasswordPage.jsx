import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";

const parseHashParams = (hash) => {
  const raw = (hash || "").replace(/^#/, "");
  const params = new URLSearchParams(raw);
  return {
    accessToken: params.get("access_token") || "",
    refreshToken: params.get("refresh_token") || "",
    type: params.get("type") || "",
    error: params.get("error") || "",
    errorDescription: params.get("error_description") || "",
  };
};

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hashInfo = useMemo(() => parseHashParams(location.hash), [location.hash]);
  const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (hashInfo.error) {
      setError(decodeURIComponent(hashInfo.errorDescription || hashInfo.error));
    }
  }, [hashInfo.error, hashInfo.errorDescription]);

  const validate = () => {
    if (!hashInfo.accessToken || hashInfo.type !== "recovery") {
      return "This password reset link is invalid or expired. Please request a new one.";
    }
    if (!form.password) return "New password is required.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (!PASSWORD_PATTERN.test(form.password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(hashInfo.accessToken, form.password);
      setSuccess(true);
      setForm({ password: "", confirmPassword: "" });
      window.history.replaceState({}, document.title, "/reset-password");
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-5">
        <div className="bg-white rounded-2xl p-10 max-w-[440px] w-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-center">
          <div className="text-[48px] mb-3">✅</div>
          <h2 className="text-[22px] font-semibold text-[#333] mb-2">Password Updated</h2>
          <p className="text-[#666] text-sm mb-6 leading-relaxed">
            Your password has been changed successfully. You can now log in with your new password.
          </p>
          <Link
            to="/"
            className="block p-[13px] bg-primary text-white rounded-lg text-[15px] font-semibold no-underline text-center hover:bg-primary-dark transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const linkProblem = (!hashInfo.accessToken || hashInfo.type !== "recovery") && !hashInfo.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-5">
      <div className="bg-white rounded-2xl p-10 max-w-[440px] w-full shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-primary text-sm no-underline hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Login
          </button>
        </div>

        <h2 className="text-[22px] font-semibold text-[#333] mb-2">Set a New Password</h2>
        <p className="text-[#888] text-sm mb-6">
          Choose a strong password you haven’t used before.
        </p>

        {error && <div className="py-3 px-4 bg-danger-light text-danger rounded-lg text-sm mb-4">{error}</div>}

        {linkProblem ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
            This reset link is missing required information.
            <div className="mt-3">
              <Link to="/forgot-password" className="text-primary font-semibold hover:underline">
                Request a new reset link
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-[#333] font-medium text-sm">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full py-3 pr-10 pl-3.5 border border-[#e0e0e0] rounded-lg text-sm outline-none box-border transition-colors duration-200 focus:border-primary"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-[#333] font-medium text-sm">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full py-3 pr-10 pl-3.5 border border-[#e0e0e0] rounded-lg text-sm outline-none box-border transition-colors duration-200 focus:border-primary"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-[14px] bg-primary text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer text-center transition-colors hover:bg-primary-dark ${
                loading ? "opacity-70" : "opacity-100"
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;

