import { useNavigate } from "react-router-dom";

function PatientTopbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/", { replace: true });
  }

  return (
    <header className="admin-topbar">
      <div>
        <h1>Patient Dashboard</h1>
        <p>Manage appointments, bills, and medical records</p>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default PatientTopbar;