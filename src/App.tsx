import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import NurseDashboard from "./pages/dashboards/NurseDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import NotFound from "./pages/PageNotFound";
import AdminLayout from "./components/layout/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDoctors from "./pages/admin/AdminDoctor";
import AdminPatients from "./pages/admin/AdminPatient";
import AdminNurses from "./pages/admin/AdminNurse";
import AdminAppointments from "./pages/admin/AdminAppointment";
import AdminBills from "./pages/admin/AdminBills";
import AdminDepartments from "./pages/admin/AdminDepartment";
import AdminMedicines from "./pages/admin/AdminMedicine";
import PatientLayout from "./components/layout/PatientLayout";
import PatientBookAppointment from "./pages/patient/PatientBookAppointment";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientBills from "./pages/patient/PatientBills";
import PatientMedicalRecords from "./pages/patient/PatientMedicalRecords";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-doctors" element={<AdminDoctors />} />
            <Route path="/admin-patients" element={<AdminPatients />} />
            <Route path="/admin-nurses" element={<AdminNurses />} />
            <Route path="/admin-appointments" element={<AdminAppointments />} />
            <Route path="/admin-bills" element={<AdminBills />} />
            <Route path="/admin-departments" element={<AdminDepartments />} />
            <Route path="/admin-medicines" element={<AdminMedicines />} />
          </Route>

            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
           
            <Route path="/nurse-dashboard" element={<NurseDashboard />} />
           
          <Route element={<PatientLayout />}>
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route
              path="/patient-book-appointment"
              element={<PatientBookAppointment />}
            />
            <Route
              path="/patient-appointments"
              element={<PatientAppointments />}
            />
            <Route path="/patient-bills" element={<PatientBills />} />
            <Route
              path="/patient-medical-records"
              element={<PatientMedicalRecords />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
