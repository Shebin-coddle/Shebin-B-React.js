import { Outlet } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";
import PatientTopbar from "./PatientTopbar";
import "../../styles/Layout.css";

function PatientLayout() {
  return (
    <div className="admin-layout">
      <PatientSidebar />

      <div className="admin-main">
        <PatientTopbar />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PatientLayout;