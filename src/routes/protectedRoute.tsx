import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("role_id");

  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const path = location.pathname;

  if (path === "/admin-dashboard" && roleId !== "1") {
    return <Navigate to="/" replace />;
  }

  if (path === "/doctor-dashboard" && roleId !== "2") {
    return <Navigate to="/" replace />;
  }
  if (path === "/patient-dashboard" && roleId !== "3") {
    return <Navigate to="/" replace />;
  }
  if (path === "/nurse-dashboard" && roleId !== "4") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
