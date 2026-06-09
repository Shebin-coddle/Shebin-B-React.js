import { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { getAllAppointments } from "../../services/AppointmentService";
import { getAllBills } from "../../services/BillService";
import { getMedicalRecordsByPatientId } from "../../services/MedicalRecordService";
import type { Appointment } from "../../types/AppointmentTypes";
import type { Bill } from "../../types/BillTypes";
import type { MedicalRecord } from "../../types/MedicalRecordTypes";

function PatientDashboard() {
  const userId = Number(localStorage.getItem("user_id"));

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchPatientDashboard() {
      try {
        const appointmentData = await getAllAppointments();
        const billData = await getAllBills();
        const recordData = await getMedicalRecordsByPatientId(userId);

        setAppointments(
          appointmentData.filter(
            (appointment) => appointment.patient_id === userId,
          ),
        );

        setBills(billData.filter((bill) => bill.patient_id === userId));

        setMedicalRecords(recordData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching patient dashboard");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPatientDashboard();
  }, [userId]);

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  );

  const bookedAppointments = appointments.filter(
    (appointment) => appointment.status === "booked",
  );

  const pendingBills = bills.filter((bill) => bill.status === "pending");

  if (loading) {
    return <p>Loading patient dashboard...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
       <h2>Overview</h2>

      <div className="dashboard-card-grid">
        <DashboardCard title="My Appointments" count={appointments.length} />

        <DashboardCard
          title="Pending Appointments"
          count={pendingAppointments.length}
        />

        <DashboardCard
          title="Booked Appointments"
          count={bookedAppointments.length}
        />

        <DashboardCard title="Pending Bills" count={pendingBills.length} />

        <DashboardCard title="Medical Records" count={medicalRecords.length} />
      </div>
    </section>
  );
}

export default PatientDashboard;
