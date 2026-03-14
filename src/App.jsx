import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import StaffDashboard from "./pages/dashboard/StaffDashboard";
import ScholarDashboard from "./pages/dashboard/ScholarDashboard";
import PrivateRoute from "./components/layout/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

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
            <ScholarDashboard />
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
