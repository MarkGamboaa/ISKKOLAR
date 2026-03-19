import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageSpinner } from "../common/Spinner";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading, getRoleDashboard } = useAuth();

  if (loading) {
    return <PageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.userType)) {
    return <Navigate to={getRoleDashboard(user?.userType)} replace />;
  }

  return children;
};

export default PrivateRoute;
