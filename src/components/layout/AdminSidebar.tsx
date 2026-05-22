import { NavLink } from "react-router-dom";

const adminMenuItems = [
  { path: "/admin-dashboard", label: "Dashboard" },
  { path: "/admin-users", label: "Users" },
  { path: "/admin-doctors", label: "Doctors" },
  { path: "/admin-nurses", label: "Nurses" },
  { path: "/admin-patients", label: "Patients" },
  { path: "/admin-appointments", label: "Appointments" },
  { path: "/admin-bills", label: "Bills" },
  { path: "/admin-departments", label: "Departments" },
  { path: "/admin-medicines", label: "Medicines" },
];

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">Hospital Admin</h2>

      <nav className="admin-menu">
        {adminMenuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className="admin-menu-link">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
