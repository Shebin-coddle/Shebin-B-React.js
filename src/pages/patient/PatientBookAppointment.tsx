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
import EditForm from "../../components/EditForm";
import { useNavigate } from "react-router-dom";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const departmentData = await getAllDepartments();
        const doctorData = await getDoctorsWithDetails();

        setDepartments(departmentData);
        setDoctors(doctorData);
      } catch (err) {
        if (err instanceof Error) {
          setErrors({ form: err.message });
        } else {
          setErrors({
            form: "Error occurred while loading appointment data",
          });
        }
      }
    }

    fetchData();
  }, []);
  
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.department_id === selectedDepartmentId,
  );

  const fields = [
    {
      name: "department",
      label: "Department",
      type: "select" as const,
      value: selectedDepartmentId,
      options: [
        { label: "Select Department", value: 0 },
        ...departments.map((d) => ({
          label: d.department_name,
          value: d.id,
        })),
      ],
    },
    {
      name: "doctor",
      label: "Doctor",
      type: "select" as const,
      value: selectedDoctorId,
      options: [
        { label: "Select Doctor", value: 0 },
        ...filteredDoctors.map((doc) => ({
          label: `Dr. ${doc.first_name} ${doc.last_name} - ${doc.specialization}`,
          value: doc.user_id,
        })),
      ],
    },
    {
      name: "appointmentDate",
      label: "Appointment Date",
      type: "date" as const,
      value: appointmentDate,
    },
    {
      name: "startTime",
      label: "Start Time",
      type: "time" as const,
      value: startTime,
    },
    {
      name: "endTime",
      label: "End Time",
      type: "time" as const,
      value: endTime,
    },
  ];

  async function handleBookAppointment(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");

    const today = new Date().toISOString().slice(0, 10);

    const validationErrors: Record<string, string> = {};

    if (!selectedDepartmentId) {
      validationErrors.department = "Please select a department";
    }

    if (!selectedDoctorId) {
      validationErrors.doctor = "Please select a doctor";
    }

    if (!appointmentDate) {
      validationErrors.appointmentDate = "Please select appointment date";
    }

    if (appointmentDate && appointmentDate < today) {
      validationErrors.appointmentDate =
        "Appointment date cannot be in the past";
    }

    if (!startTime) {
      validationErrors.startTime = "Please select start time";
    }

    if (!endTime) {
      validationErrors.endTime = "Please select end time";
    }

    if (startTime && endTime && startTime >= endTime) {
      validationErrors.endTime = "End time must be after start time";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
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
        setErrors({ form: err.message });
      } else {
        setErrors({ form: "Error occurred while booking appointment" });
      }
    }
  }
  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    switch (name) {
      case "department":
        setSelectedDepartmentId(Number(value));
        setSelectedDoctorId(0);
        break;

      case "doctor":
        setSelectedDoctorId(Number(value));
        break;

      case "appointmentDate":
        setAppointmentDate(value);
        break;

      case "startTime":
        setStartTime(value);
        break;

      case "endTime":
        setEndTime(value);
        break;
    }
  }

  return (
    <section>
      <h2>Book Appointment</h2>

      {message && <p className="success">{message}</p>}
      {errors.form && <p className="error">{errors.form}</p>}

      <EditForm
        title="Book Appointment"
        fields={fields}
        errors={errors}
        onChange={handleFieldChange}
        onSubmit={handleBookAppointment}
        onCancel={() => navigate("/patient-dashboard")}
      />
    </section>
  );
}

export default PatientBookAppointment;
