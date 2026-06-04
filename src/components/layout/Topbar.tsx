import { useNavigate } from "react-router-dom";
type TopbarProps = {
  title: string;
};

function Topbar({ title }: TopbarProps) {
   const navigate=useNavigate();

  function handleLogout(){
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");

    navigate("/",{replace:true});
  }
  return (
    <header className="topbar">
      <h2>{title}</h2>
       <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </header>
    
  );
}

export default Topbar;