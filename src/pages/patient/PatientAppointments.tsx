import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import {
  cancelAppointment,
  getAllAppointments,
} from "../../services/AppointmentService";
import type { Appointment } from "../../types/AppointmentTypes";
import { getDoctorsWithDetails } from "../../services/DoctorService";
import type { DoctorDetails } from "../../types/DoctorTypes";

function PatientAppointments() {
  const patientId = Number(localStorage.getItem("user_id"));

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);

  useEffect(() => {
    async function fetchPatientAppointments() {
      try {
        const appointmentData = await getAllAppointments();

        const doctorData = await getDoctorsWithDetails();

        setDoctors(doctorData);

        const patientAppointments = appointmentData.filter(
          (appointment) => appointment.patient_id === patientId,
        );

        setAppointments(patientAppointments);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching appointments");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPatientAppointments();
  }, [patientId]);

  async function handleCancel(id: number) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await cancelAppointment(id);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment,
        ),
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while cancelling appointment");
      }
    }
  }
  function getDoctorName(doctorId: number) {
    const doctor = doctors.find((doctor) => doctor.user_id === doctorId);

    if (!doctor) {
      return "Unknown Doctor";
    }

    return `Dr. ${doctor.first_name} ${doctor.last_name}`;
  }

  const columns = [
    {
      header: "Doctor",
      render: (appointment: Appointment) =>
        getDoctorName(appointment.doctor_id),
    },
    {
      header: "Date",
      render: (appointment: Appointment) => new Date(appointment.appointment_date).toLocaleDateString("en-IN"),
    },
    {
      header: "Start Time",
      render: (appointment: Appointment) => appointment.start_time,
    },
    {
      header: "End Time",
      render: (appointment: Appointment) => appointment.end_time,
    },
    {
      header: "Status",
      render: (appointment: Appointment) => appointment.status,
    },
    {
      header: "Actions",
      render: (appointment: Appointment) => (
        <div className="table-actions">
          {appointment.status === "pending" && (
            <button onClick={() => handleCancel(appointment.id)}>Cancel</button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>My Appointments</h2>

      <DataTable columns={columns} data={appointments} />
    </section>
  );
}

export default PatientAppointments;
