import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import ProtectedRoute from "./routes/protectedRoute";
import AdminDashboard from "./pages/dashboards/adminDashboard";
import DoctorDashboard from "./pages/dashboards/doctorDashboard";
import NurseDashboard from "./pages/dashboards/nurseDashboard";
import PatientDashboard from "./pages/dashboards/patientDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/nurse-dashboard" element={<NurseDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
