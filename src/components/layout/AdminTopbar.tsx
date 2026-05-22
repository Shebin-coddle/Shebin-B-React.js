import { useNavigate } from "react-router-dom";

function AdminTopbar() {

    const navigate=useNavigate();

  function handleLogout(){
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");

    navigate("/",{replace:true});
  }



  return (
    <header className="admin-topbar">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Manage hospital operations</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default AdminTopbar;