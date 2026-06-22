import { FaUserCircle } from "react-icons/fa";
import "../../styles/topBar.css";
import { useNavigate } from "react-router-dom";

type TopbarProps = {
  title: string;
};

function Topbar({ title }: TopbarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");

    navigate("/", { replace: true });
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
    <header className="topbar">
      <h2 className="topbar-title">{title}</h2>

      <div className="topbar-actions">
        <FaUserCircle
          className="profile-icon"
          onClick={handleProfile}
        />

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;