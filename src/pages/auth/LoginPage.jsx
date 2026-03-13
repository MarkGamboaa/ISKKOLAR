import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import kkfiLogo from "../../assets/KKFI LOGO.png";

const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.password.trim()) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setApiError("");
    try {
      await login(form.email, form.password);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.loginPage}>
      {/* Left Side - Branding */}
      <div style={styles.loginLeft}>
        <div style={styles.logoContainer}>
          <img src={kkfiLogo} alt="KKFI Logo" style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <h1 style={styles.brandingTitle}>KAPATIRAN-KAUNLARAN</h1>
        <h2 style={styles.brandingSubtitle}>SCHOLAR MONITORING PORTAL</h2>
        <p style={styles.brandingDescription}>
          A centralized web and mobile platform for submitting requirements, monitoring academic and service compliance, and managing scholar records.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.loginRight}>
        <div style={styles.loginCard}>
          <h2 style={styles.cardTitle}>Welcome Back</h2>
          <p style={styles.subtitle}>Please enter your details to sign in</p>

          {apiError && (
            <div style={styles.errorBox}>{apiError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  style={{ ...styles.input, borderColor: errors.email ? '#dc2626' : '#e0e0e0' }}
                />
                <span style={styles.inputIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 18, height: 18 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </span>
              </div>
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  style={{ ...styles.input, borderColor: errors.password ? '#dc2626' : '#e0e0e0' }}
                />
                <span style={styles.inputIcon} onClick={() => setShowPassword(!showPassword)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 18, height: 18 }}>
                    {showPassword ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    )}
                  </svg>
                </span>
              </div>
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            <div style={styles.rememberRow}>
              <label style={styles.rememberLabel}>
                <input type="checkbox" defaultChecked style={styles.checkbox} /> Remember Me
              </label>
              <Link to="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading} style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p style={styles.signupLink}>
              Don't have an account? <Link to="/signup" style={styles.signupAnchor}>Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loginPage: { minHeight: '100vh', display: 'flex', background: '#f5f5f5' },
  loginLeft: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px', background: '#f5f5f5', maxWidth: '57%' },
  logoContainer: { marginBottom: 16 },
  logoPlaceholder: { width: 180, height: 180, borderRadius: '50%', background: '#fff', border: '4px solid #5b5f97', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandingTitle: { fontSize: '36px', fontWeight: 800, color: '#3d4076', textAlign: 'center', letterSpacing: '-0.5px', margin: '16px 0 0' },
  brandingSubtitle: { fontSize: '28px', fontWeight: 700, color: '#3d4076', textAlign: 'center', paddingBottom: 8, margin: '4px 0 16px' },
  brandingDescription: { fontSize: '15px', color: '#666', textAlign: 'left', maxWidth: 460, lineHeight: 1.6 },
  loginRight: { flex: '0 0 500px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#f5f5f5' },
  loginCard: { background: '#fff', borderRadius: 16, padding: 40, width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 24, color: '#333', marginBottom: 8, fontWeight: 600 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 30 },
  formGroup: { marginBottom: 20 },
  label: { display: 'block', marginBottom: 8, color: '#333', fontWeight: 500, fontSize: 14 },
  inputWrapper: { position: 'relative' },
  input: { width: '100%', padding: '12px 40px 12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  inputIcon: { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer' },
  rememberRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' },
  rememberLabel: { display: 'flex', alignItems: 'center', gap: 8, color: '#666', fontSize: 14, cursor: 'pointer' },
  checkbox: { width: 16, height: 16, accentColor: '#5b5f97' },
  forgotLink: { color: '#5b5f97', textDecoration: 'none', fontSize: 14 },
  loginBtn: { width: '100%', padding: 14, background: '#5b5f97', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'center', transition: 'background 0.2s' },
  signupLink: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' },
  signupAnchor: { color: '#5b5f97', textDecoration: 'none', fontWeight: 500 },
  errorBox: { padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 14, marginBottom: 20 },
  errorText: { fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' },
};

export default LoginPage;
