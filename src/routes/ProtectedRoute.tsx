import { Navigate, Outlet, useLocation } from "react-router-dom";

const allowedRoles: Record<string, string> = {
  "/admin-dashboard": "1",
  "/doctor-dashboard": "2",
  "/patient-dashboard": "3",
  "/nurse-dashboard": "4",
};

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("role_id");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const requiredRole = allowedRoles[location.pathname];

  if (requiredRole && roleId !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

export default ProtectedRoute;