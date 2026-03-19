import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./views/HomePage";
import LoginPage from "./views/auth/LoginPage";
import SignupPage from "./views/auth/SignupPage";
import ForgotPasswordPage from "./views/auth/ForgotPasswordPage";
import ResetPasswordPage from "./views/auth/ResetPasswordPage";
import AdminDashboard from "./views/admin/AdminDashboard";
import StaffDashboard from "./views/staff/StaffDashboard";
import ScholarDashboard from "./views/scholar/ScholarDashboard";
import ApplicantDashboard from "./views/applicant/ApplicantDashboard";
import PrivateRoute from "./components/layout/PrivateRoute";

// Component to handle auth redirects from email links
const AuthRedirectHandler = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're on the homepage with recovery/reset hash params
    const hash = location.hash;
    if (hash && location.pathname === "/") {
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const type = params.get("type");
      const accessToken = params.get("access_token");

      // If it's a password recovery link, redirect to reset-password page
      if (type === "recovery" && accessToken) {
        navigate(`/reset-password${hash}`, { replace: true });
        return;
      }

      // If it's an email verification link, you can handle it here too
      if (type === "signup" || type === "email_change") {
        // Email verified, redirect to login
        navigate("/login?verified=true", { replace: true });
        return;
      }
    }
  }, [location, navigate]);

  return children;
};

function App() {
  return (
    <AuthRedirectHandler>
      <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected — Admin */}
      <Route
        path="/dashboard/admin/*"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Protected — Staff */}
      <Route
        path="/dashboard/staff/*"
        element={
          <PrivateRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/applicant/*"
        element={
          <PrivateRoute allowedRoles={["applicant"]}>
            <ApplicantDashboard />
          </PrivateRoute>
        }
      />
      {/* Protected — Scholar / Applicant */}
      <Route
        path="/dashboard/scholar/*"
        element={
          <PrivateRoute allowedRoles={["scholar"]}>
            <ScholarDashboard />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </AuthRedirectHandler>
  );
}

export default App;
