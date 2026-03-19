import { useState } from "react";
import { Link } from "react-router-dom";
import * as authService from "../../services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Invalid email format"); return; }

    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-5">
      <div className="bg-white rounded-2xl p-10 max-w-[420px] w-full shadow-[0_4px_20px_rgba(0,0,0,0.08)]">

        {success ? (
          <div className="text-center">
            <div className="text-[48px] mb-3">📧</div>
            <h2 className="text-[22px] font-semibold text-[#333] mb-2">Check Your Email</h2>
            <p className="text-[#666] text-sm mb-6 leading-relaxed">A password reset link has been sent to your email address.</p>
            <Link to="/" className="block p-[13px] bg-[#5b5f97] text-white rounded-lg text-[15px] font-semibold no-underline text-center hover:bg-[#4a4e7d] transition-colors">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-[22px] font-semibold text-[#333] mb-2">Forgot Password</h2>
            <p className="text-[#888] text-sm mb-6">Enter your email and we'll send you a reset link</p>

            {error && <div className="py-3 px-4 bg-[#fee2e2] text-[#dc2626] rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block mb-2 text-[#333] font-medium text-sm">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-3.5 border border-[#e0e0e0] rounded-lg text-sm outline-none box-border transition-colors duration-200 focus:border-[#5b5f97]"
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" disabled={loading} className={`w-full p-[14px] bg-[#5b5f97] text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer text-center transition-colors hover:bg-[#4a4e7d] ${loading ? 'opacity-70' : 'opacity-100'}`}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

