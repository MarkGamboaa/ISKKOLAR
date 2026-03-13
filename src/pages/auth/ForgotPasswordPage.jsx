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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 420, width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5b5f97', fontSize: 14, textDecoration: 'none', marginBottom: 20 }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 16, height: 16 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Login
        </Link>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#333', marginBottom: 8 }}>Check Your Email</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>A password reset link has been sent to your email address.</p>
            <Link to="/" style={{ display: 'block', padding: 13, background: '#5b5f97', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#333', marginBottom: 8 }}>Forgot Password</h2>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>Enter your email and we'll send you a reset link</p>

            {error && <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#333', fontWeight: 500, fontSize: 14 }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: '#5b5f97', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
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
