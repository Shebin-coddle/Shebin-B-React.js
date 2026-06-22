import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import NurseDashboard from "./pages/dashboards/NurseDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import NotFound from "./pages/PageNotFound";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDoctors from "./pages/admin/AdminDoctor";
import AdminPatients from "./hoc/AdminPatients.withUserMap";
import AdminNurses from "./pages/admin/AdminNurse";
import AdminAppointments from "./pages/admin/AdminAppointment";
import AdminBills from "./pages/admin/AdminBills";
import AdminDepartments from "./pages/admin/AdminDepartment";
import AdminMedicines from "./pages/admin/AdminMedicine";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import PatientBookAppointment from "./pages/patient/PatientBookAppointment";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientBills from "./pages/patient/PatientBills";
import PatientMedicalRecords from "./pages/patient/PatientMedicalRecords";
import NurseAppointments from "./pages/nurse/NurseAppointments";
import Layout from "./components/layout/Layout";
import UserForm from "./pages/admin/UserForm";
import DepartmentForm from "./pages/admin/DepartmentForm";
import MedicineForm from "./pages/admin/MedicineForm";
import AppointmentForm from "./pages/admin/AppointmentForm";
import BillForm from "./pages/admin/BillForm";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoctorBookingPage from "./pages/DoctorBookingPage";
import PatientLayout from "./components/layout/PatientLayout";
import { adminMenu, doctorMenu, nurseMenu } from "./components/Labels/Menu";
import PatientRegistration from "./pages/patient/RegisterForm";
import About from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Layout
                sidebarTitle="Hospital Admin"
                topbarTitle="Admin Dashboard"
                menuItems={adminMenu}
              />
            }
          >
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/Admin-profile" element={<Profile />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-users/add" element={<UserForm />} />
            <Route path="/admin-users/edit/:id" element={<UserForm />} />
            <Route path="/admin-doctors" element={<AdminDoctors />} />

            <Route path="/admin-patients" element={<AdminPatients />} />

            <Route path="/admin-nurses" element={<AdminNurses />} />

            <Route path="/admin-appointments" element={<AdminAppointments />} />
            <Route
              path="/admin-appointments/add"
              element={<AppointmentForm />}
            />
            <Route
              path="/admin-appointments/edit/:id"
              element={<AppointmentForm />}
            />
            <Route path="/admin-bills" element={<AdminBills />} />
            <Route path="/admin-bills/add" element={<BillForm />} />
            <Route path="/admin-bills/edit/:id" element={<BillForm />} />
            <Route path="/admin-departments" element={<AdminDepartments />} />
            <Route path="/admin-medicines" element={<AdminMedicines />} />
            <Route path="/admin-medicines/add" element={<MedicineForm />} />
            <Route
              path="/admin-medicines/edit/:id"
              element={<MedicineForm />}
            />
            <Route path="/admin-departments/add" element={<DepartmentForm />} />
            <Route
              path="/admin-departments/edit/:id"
              element={<DepartmentForm />}
            />
          </Route>

          <Route
            element={
              <Layout
                sidebarTitle="Doctor Portal"
                topbarTitle="Doctor Dashboard"
                menuItems={doctorMenu}
              />
            }
          >
            <Route path="/doctor-profile" element={<Profile />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route
              path="/doctor-appointments"
              element={<DoctorAppointments />}
            />
          </Route>

          <Route
            element={
              <Layout
                sidebarTitle="Nurse Portal"
                topbarTitle="Nurse Dashboard"
                menuItems={nurseMenu}
              />
            }
          >
            <Route path="/nurse-profile" element={<Profile />} />
            <Route path="/nurse-dashboard" element={<NurseDashboard />} />
            <Route path="/nurse-appointments" element={<NurseAppointments />} />
          </Route>

          <Route element={<PatientLayout />}>
            <Route path="/patient-profile" element={<Profile />} />
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
            <Route path="/doctor-list" element={<DoctorBookingPage />} />
          </Route>
        </Route>
        <Route path="/" element={<Home />} />
        <Route
              path="/patient-registration"
              element={<PatientRegistration />}
            />
             <Route
              path="/patient-registration/edit/:id"
              element={<PatientRegistration />}
            />

        <Route path="*" element={<NotFound />} />
        <Route path="about" element={<About />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
