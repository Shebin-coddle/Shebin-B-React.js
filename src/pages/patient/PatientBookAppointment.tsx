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
        if (err instanceof Error) setError(err.message);
        else setError("Error occurred while loading appointment data");
      }
    }

    fetchInitialData();
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.department_id === selectedDepartmentId
  );

  function handleDepartmentChange(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedDepartmentId(Number(e.target.value));
    setSelectedDoctorId(0);
  }

  async function handleBookAppointment(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    const today = new Date().toISOString().slice(0, 10);

    if (!patientId) return setError("Patient ID not found. Please login again.");
    if (!selectedDepartmentId) return setError("Please select a department");
    if (!selectedDoctorId) return setError("Please select a doctor");
    if (!appointmentDate) return setError("Please select appointment date");
    if (appointmentDate < today)
      return setError("Appointment date cannot be in the past");
    if (!startTime) return setError("Please select start time");
    if (!endTime) return setError("Please select end time");
    if (startTime >= endTime)
      return setError("End time must be after start time");

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
      if (err instanceof Error) setError(err.message);
      else setError("Error occurred while booking appointment");
    }
  }

  return (
    <section>
      <h2>Book Appointment</h2>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form className="edit-user-form" onSubmit={handleBookAppointment}>
      
        <select
          data-testid="department-select"
          value={selectedDepartmentId}
          onChange={handleDepartmentChange}
        >
          <option value={0}>Select Department</option>

          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.department_name}
            </option>
          ))}
        </select>

        <select
          data-testid="doctor-select"
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
          disabled={!selectedDepartmentId}
        >
          <option value={0}>Select Doctor</option>

          {filteredDoctors.map((doc) => (
            <option key={doc.user_id} value={doc.user_id}>
              Dr. {doc.first_name} {doc.last_name} - {doc.specialization}
            </option>
          ))}
        </select>

      
        <input
          data-testid="appointment-date"
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />

   
        <input
          data-testid="start-time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          data-testid="end-time"
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