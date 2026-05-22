import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { getAllDepartments } from "../../services/DepartmentService";
import { getDoctorsWithDetails } from "../../services/DoctorService";
import { createAppointment } from "../../services/AppointmentService";
import type { Department } from "../../types/DepartmentTypes";
import type { DoctorDetails } from "../../types/DoctorTypes";

function PatientBookAppointment() {
  const patientId = Number(localStorage.getItem("user_id"));

  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(0);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const departmentData = await getAllDepartments();
        const doctorData = await getDoctorsWithDetails();

        setDepartments(departmentData);
        setDoctors(doctorData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while loading appointment data");
        }
      }
    }

    fetchInitialData();
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.department_id === selectedDepartmentId,
  );

  function handleDepartmentChange(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedDepartmentId(Number(e.target.value));
    setSelectedDoctorId(0);
  }

  async function handleBookAppointment(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    const today = new Date().toISOString().split("T")[0];

if (!patientId) {
  setError("Patient ID not found. Please login again.");
  return;
}

if (!selectedDepartmentId) {
  setError("Please select a department");
  return;
}

if (!selectedDoctorId) {
  setError("Please select a doctor");
  return;
}

if (!appointmentDate) {
  setError("Please select appointment date");
  return;
}

if (appointmentDate < today) {
  setError("Appointment date cannot be in the past");
  return;
}

if (!startTime) {
  setError("Please select start time");
  return;
}

if (!endTime) {
  setError("Please select end time");
  return;
}

if (startTime >= endTime) {
  setError("End time must be after start time");
  return;
}

    try {
      await createAppointment({
        doctor_id: selectedDoctorId,
        patient_id: patientId,
        appointment_date: appointmentDate,
        start_time: startTime,
        end_time: endTime,
        status: "pending",
      });

      setMessage("Appointment request submitted successfully");

      setSelectedDepartmentId(0);
      setSelectedDoctorId(0);
      setAppointmentDate("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while booking appointment");
      }
    }
  }

  return (
    <section>
      <h2>Book Appointment</h2>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form className="edit-user-form" onSubmit={handleBookAppointment}>
        <select value={selectedDepartmentId} onChange={handleDepartmentChange}>
          <option value={0}>Select Department</option>

          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.department_name}
            </option>
          ))}
        </select>

        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
          disabled={!selectedDepartmentId}
        >
          <option value={0}>Select Doctor</option>

          {filteredDoctors.map((doctor) => (
            <option key={doctor.user_id} value={doctor.user_id}>
              Dr. {doctor.first_name} {doctor.last_name} -{" "}
              {doctor.specialization}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <button type="submit">Book Appointment</button>
      </form>
    </section>
  );
}

export default PatientBookAppointment;
