import { useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="home-navbar">
      <div className="home-logo" onClick={() => navigate("/")}>
      City Hospital
      </div>

      <nav className="nav-links">
        <a href="#services">Services</a>
        {/* <a href="#">About Us</a> */}
        <a href="#appointment">Book Appointment</a>
        <a href="#footer">Contact</a>
      </nav>

      <div className="nav-actions">
        <button
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </header>
  );
}

export default Navbar;