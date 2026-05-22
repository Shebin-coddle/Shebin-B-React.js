import { NavLink } from "react-router-dom";

const patientMenuItems = [
  { path: "/patient-dashboard", label: "Dashboard" },
  { path: "/patient-book-appointment", label: "Book Appointment" },
  { path: "/patient-appointments", label: "My Appointments" },
  { path: "/patient-bills", label: "My Bills" },
  { path: "/patient-medical-records", label: "My Medical Records" },
];

function PatientSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">Patient Panel</h2>

      <nav className="admin-menu">
        {patientMenuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className="admin-menu-link">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default PatientSidebar;