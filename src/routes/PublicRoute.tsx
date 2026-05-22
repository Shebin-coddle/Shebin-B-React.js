import { Navigate, Outlet } from "react-router-dom";

const roleRoutes: Record<string, string> = {
  "1": "/admin-dashboard",
  "2": "/doctor-dashboard",
  "3": "/patient-dashboard",
  "4": "/nurse-dashboard",
};

function PublicRoute() {
  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("role_id");

  if (token && roleId) {
    const dashboardPath = roleRoutes[roleId];

    if (dashboardPath) {
      return <Navigate to={dashboardPath} replace />;
    }
  }
  return <Outlet />;
}

export default PublicRoute;