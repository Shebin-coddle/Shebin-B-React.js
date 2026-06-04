import { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { getAllAppointments } from "../../services/AppointmentService";
import type { Appointment } from "../../types/AppointmentTypes";

function DoctorDashboard() {
  const userId = localStorage.getItem("user_id");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchDoctorAppointments() {
      try {
        const appointmentData = await getAllAppointments();

        const doctorAppointments = appointmentData.filter(
          (appointment) => appointment.doctor_id === Number(userId),
        );
        setAppointments(doctorAppointments);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occured while fetching appointments");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDoctorAppointments();
  }, [userId]);

  const bookedAppointments = appointments.filter(
    (appointment) => appointment.status === "booked",
  );

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  );

  if (loading) {
    return <p>Loading doctor dashboard..</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>Doctor Dashboard</h2>
      <div className="dashboard-card-grid">
        <DashboardCard title="My Appointments" count={appointments.length} />
        <DashboardCard
          title="Completed Appointments"
          count={bookedAppointments.length}
        />
        <DashboardCard
          title="Pending Appointments"
          count={pendingAppointments.length}
        />
      </div>
    </section>
  );
}

export default DoctorDashboard;
