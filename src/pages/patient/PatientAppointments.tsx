import { useEffect, useState } from "react";
import {
  cancelAppointment,
  getAllAppointments,
} from "../../services/AppointmentService";
import type { Appointment } from "../../types/AppointmentTypes";
import { getDoctorsWithDetails } from "../../services/DoctorService";
import type { DoctorDetails } from "../../types/DoctorTypes";
import "../../styles/appointmentPage.css"
import DateSearch from "../../components/DateSearch";

function PatientAppointments() {
  const patientId = Number(localStorage.getItem("user_id"));

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);
  const [selectedDate, setSelectedDate]=useState("");

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
const filteredAppointments=appointments.filter((appointment)=>{
  const appointmentDate=new Date(appointment.appointment_date,).toLocaleDateString("en-CA");
  const matchingDate=!selectedDate || appointmentDate===selectedDate;
   return matchingDate
});

  function getDoctorName(doctorId: number) {
    const doctor = doctors.find((doctor) => doctor.user_id === doctorId);

    if (!doctor) {
      return "Unknown Doctor";
    }

    return `Dr. ${doctor.first_name} ${doctor.last_name}`;
  }


  if (loading) {
    return <p>Loading appointments...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>My Appointments</h2>

       <DateSearch
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onClear={() => setSelectedDate("")}
      />

<div className="appointment-card-container">
  {filteredAppointments.map((appointment) => (
    <div
      key={appointment.id}
      className="appointment-card"
    >
      <div className="appointment-card-header">
        <h3>
          {getDoctorName(appointment.doctor_id).toUpperCase()}
        </h3>

        <span
          className={`status ${appointment.status}`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="appointment-details">
        <p>
          <strong>Date:</strong>{" "}
          {new Date(
            appointment.appointment_date,
          ).toLocaleDateString("en-IN")}
        </p>

        <p>
          <strong>Start Time:</strong>{" "}
          {appointment.start_time}
        </p>

        <p>
          <strong>End Time:</strong>{" "}
          {appointment.end_time}
        </p>
      </div>

      {appointment.status === "pending" && (
        <button
          className="cancel-btn"
          onClick={() =>
            handleCancel(appointment.id)
          }
        >
          Cancel Appointment
        </button>
      )}
    </div>
  ))}

  {!appointments.length && (
    <p className="no-data">
      No appointments found.
    </p>
  )}
</div>    </section>
  );
}

export default PatientAppointments;
