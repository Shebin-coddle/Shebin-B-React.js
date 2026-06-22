import { useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import { HandleBookAppointments } from "../../services/HandleBookAppointments";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const roleId = localStorage.getItem("role_id");
  const dispatch = useDispatch();

function handleLogout() {
  dispatch(logout());

  localStorage.clear();

  navigate("/login");
}

  function handleProfile() {
    const roleId = Number(localStorage.getItem("role_id"));

    switch (roleId) {
      case 1:
        navigate("/admin-profile");
        break;
      case 2:
        navigate("/doctor-profile");
        break;
      case 3:
        navigate("/patient-profile");
        break;
      case 4:
        navigate("/nurse-profile");
        break;
    }
  }

  return (
    <header className="home-navbar">
      <div className="home-logo" onClick={() => navigate("/")}>
        City Hospital
      </div>

      <nav className="nav-links">
        <a href="/">Home</a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();

            HandleBookAppointments(
              navigate,
              Number(localStorage.getItem("role_id")),
            );
          }}
        >
          Book Appointment
        </a>{" "}
        <a href="/about">About</a>
        {roleId === "3" && (
          <>
          <a href="/patient-dashboard">Overview</a>
            <a href="/patient-appointments">Appointments</a>
            <a href="/patient-bills">Bills</a>
            <a href="/patient-medical-records">Medical Records</a>
          </>
        )}
      </nav>

      {!roleId? (
        <div className="nav-actions">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      ) : (
        <div className="topbar-actions">
              <FaUserCircle className="profile-icon" onClick={handleProfile} />

              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
            )}
    </header>
  );
}

export default Navbar;
