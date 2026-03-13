import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", scholarshipType: "Tertiary" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setApiError("");
    try {
      await authService.register({ ...form, userType: "applicant" });
      setSuccess(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.centerCard}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: '#333', marginBottom: 8 }}>Account Created!</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Your account has been created successfully. You can now log in.</p>
            <Link to="/" style={styles.loginBtn}>Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginLeft}>
        <div style={styles.logoPlaceholder}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5b5f97" style={{ width: 80, height: 80 }}>
            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z"/>
            <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z"/>
          </svg>
        </div>
        <h1 style={styles.brandingTitle}>KAPATIRAN-KAUNLARAN</h1>
        <h2 style={styles.brandingSubtitle}>SCHOLAR MONITORING PORTAL</h2>
        <p style={styles.brandingDescription}>Join our scholarship program and access tools for academic and service compliance monitoring.</p>
      </div>

      <div style={styles.loginRight}>
        <div style={styles.loginCard}>
          <Link to="/" style={styles.backBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 16, height: 16 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Login
          </Link>
          <h2 style={styles.cardTitle}>Create Account</h2>
          <p style={styles.cardSubtitle}>Fill in your details to apply for a scholarship</p>

          {apiError && <div style={styles.errorBox}>{apiError}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name</label>
                <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={styles.input} />
                {errors.firstName && <span style={styles.errText}>{errors.firstName}</span>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name</label>
                <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={styles.input} />
                {errors.lastName && <span style={styles.errText}>{errors.lastName}</span>}
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={styles.input} />
              {errors.email && <span style={styles.errText}>{errors.email}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Scholarship Type</label>
              <select value={form.scholarshipType} onChange={(e) => setForm({ ...form, scholarshipType: e.target.value })} style={styles.input}>
                <option value="Tertiary">Tertiary Education Scholarship</option>
                <option value="Vocational">Vocational Training Scholarship</option>
                <option value="SDEA">SDEA</option>
                <option value="Board Exam Assistance">Board Exam Assistance</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={styles.input} />
              {errors.password && <span style={styles.errText}>{errors.password}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} style={styles.input} />
              {errors.confirmPassword && <span style={styles.errText}>{errors.confirmPassword}</span>}
            </div>
            <button type="submit" disabled={loading} style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <p style={styles.signupLink}>Already have an account? <Link to="/" style={styles.signupAnchor}>Sign In</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loginPage: { minHeight: '100vh', display: 'flex', background: '#f5f5f5' },
  loginLeft: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', background: '#f5f5f5', maxWidth: '50%' },
  logoPlaceholder: { width: 140, height: 140, borderRadius: '50%', background: '#fff', border: '4px solid #5b5f97', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  brandingTitle: { fontSize: '32px', fontWeight: 800, color: '#3d4076', textAlign: 'center', margin: '0 0 4px' },
  brandingSubtitle: { fontSize: '24px', fontWeight: 700, color: '#3d4076', textAlign: 'center', margin: '0 0 16px' },
  brandingDescription: { fontSize: '14px', color: '#666', textAlign: 'center', maxWidth: 400, lineHeight: 1.6 },
  loginRight: { flex: '0 0 520px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto', maxHeight: '100vh' },
  loginCard: { background: '#fff', borderRadius: 16, padding: '32px 36px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  centerCard: { background: '#fff', borderRadius: 16, padding: 40, maxWidth: 420, width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', margin: '0 auto' },
  backBtn: { display: 'flex', alignItems: 'center', gap: 6, color: '#5b5f97', fontSize: 14, textDecoration: 'none', marginBottom: 16 },
  cardTitle: { fontSize: 22, color: '#333', marginBottom: 6, fontWeight: 600 },
  cardSubtitle: { color: '#888', fontSize: 14, marginBottom: 24 },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', marginBottom: 6, color: '#333', fontWeight: 500, fontSize: 13 },
  input: { width: '100%', padding: '11px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  loginBtn: { display: 'block', width: '100%', padding: 13, background: '#5b5f97', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', marginTop: 8 },
  signupLink: { textAlign: 'center', marginTop: 16, fontSize: 14, color: '#666' },
  signupAnchor: { color: '#5b5f97', textDecoration: 'none', fontWeight: 500 },
  errorBox: { padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 14, marginBottom: 16 },
  errText: { fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' },
};

export default SignupPage;
