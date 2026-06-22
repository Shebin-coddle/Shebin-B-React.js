import { Outlet } from "react-router-dom";
import Navbar from "../Home/NavBar";
import "../../styles/patientLayout.css";
import BreadCrumbs from "../BreadCrumps";



function PatientLayout() {
  return (
    <div className="patient-layout">
      <Navbar />

      <main className="patient-content">
        <BreadCrumbs/>
        <Outlet />
        

      </main>
      
    </div>
    
  );
}

export default PatientLayout;