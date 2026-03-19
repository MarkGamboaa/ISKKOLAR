import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import kkfiLogo from "../../assets/KKFI LOGO.png";

const parseHashParams = (hash) => {
  const raw = (hash || "").replace(/^#/, "");
  const params = new URLSearchParams(raw);
  return {
    accessToken: params.get("access_token") || "",
    type: params.get("type") || "",
  };
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hashInfo = useMemo(() => parseHashParams(location.hash), [location.hash]);

  useEffect(() => {
    if (hashInfo.type === "recovery" && hashInfo.accessToken) {
      navigate(`/reset-password${location.hash}`, { replace: true });
    }
  }, [hashInfo.accessToken, hashInfo.type, location.hash, navigate]);

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
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* Left Side - Branding */}
      <div className="flex-1 flex flex-col justify-center items-center p-[60px] bg-[#f5f5f5] max-w-[57%]">
        <div className="mb-4">
          <img src={kkfiLogo} alt="KKFI Logo" className="w-[180px] h-[180px] rounded-full object-cover" />
        </div>
        <h1 className="text-[36px] font-extrabold text-[#3d4076] text-center tracking-[-0.5px] mt-4 mb-0">KAPATIRAN-KAUNLARAN</h1>
        <h2 className="text-[28px] font-bold text-[#3d4076] text-center pb-2 mt-1 mb-4">SCHOLAR MONITORING PORTAL</h2>
        <p className="text-[15px] text-[#666] text-left max-w-[460px] leading-[1.6]">
          A centralized web and mobile platform for submitting requirements, monitoring academic and service compliance, and managing scholar records.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-[0_0_500px] flex items-center justify-center p-10 bg-[#f5f5f5]">
        <div className="bg-white rounded-2xl p-10 w-full shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl text-[#333] mb-2 font-semibold">Welcome Back</h2>
          <p className="text-[#888] text-sm mb-[30px]">Please enter your details to sign in</p>

          {apiError && (
            <div className="py-3 px-4 bg-danger-light text-danger rounded-lg text-sm mb-5">{apiError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-[#333] font-medium text-sm">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  className={`w-full py-3 pr-10 pl-3.5 border rounded-lg text-sm outline-none box-border transition-colors duration-200 focus:border-primary ${errors.email ? 'border-[#dc2626]' : 'border-[#e0e0e0]'}`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[18px] h-[18px]">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </span>
              </div>
              {errors.email && <span className="text-xs text-[#dc2626] mt-1 block">{errors.email}</span>}
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-[#333] font-medium text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`w-full py-3 pr-10 pl-3.5 border rounded-lg text-sm outline-none box-border transition-colors duration-200 focus:border-primary ${errors.password ? 'border-[#dc2626]' : 'border-[#e0e0e0]'}`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] cursor-pointer hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[18px] h-[18px]">
                    {showPassword ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </>
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </>
                    )}
                  </svg>
                </span>
              </div>
              {errors.password && <span className="text-xs text-[#dc2626] mt-1 block">{errors.password}</span>}
            </div>

            <div className="flex justify-between items-center my-5">
              <label className="flex items-center gap-2 text-[#666] text-sm cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" /> Remember Me
              </label>
              <Link to="/forgot-password" className="text-primary no-underline text-sm hover:underline">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading} className={`w-full p-[14px] bg-primary text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer text-center transition-background duration-200 hover:bg-primary-dark ${loading ? 'opacity-70' : 'opacity-100'}`}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center mt-5 text-sm text-[#666]">
              Don't have an account? <Link to="/signup" className="text-primary no-underline font-medium hover:underline">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

