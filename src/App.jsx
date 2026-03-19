import { Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
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
  );
}

export default App;
