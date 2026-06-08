import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import DetailCard from "../../components/DetailsView";
import { getNurseById } from "../../services/NurseService";
import { getDoctorsWithDetails } from "../../services/DoctorService";
import { getAllAppointments } from "../../services/AppointmentService";
import { getPatientDetailsById } from "../../services/PatientService";
import type { Nurse } from "../../types/NurseTypes";
import type { DoctorDetails } from "../../types/DoctorTypes";
import type { Appointment } from "../../types/AppointmentTypes";

function NurseAppointments() {
  const nurseId = Number(localStorage.getItem("user_id"));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);
  const [patientNames, setPatientNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchNurseAppointments() {
      try {
        const nurseData: Nurse = await getNurseById(nurseId);
        const doctorData = await getDoctorsWithDetails();
        const appointmentData = await getAllAppointments();
        const departmentDoctors = doctorData.filter(
          (doctor) => doctor.department_id === nurseData.department_id,
        );

        const departmentDoctorIds = departmentDoctors.map(
          (doctor) => doctor.user_id,
        );

        const filteredAppointments = appointmentData.filter((appointment) =>
          departmentDoctorIds.includes(appointment.doctor_id),
        );

        const uniquePatientIds = [
          ...new Set(
            filteredAppointments.map((appointment) => appointment.patient_id),
          ),
        ];

        const patientDetailsList = await Promise.all(
          uniquePatientIds.map((patientId) => getPatientDetailsById(patientId)),
        );

        const names: Record<number, string> = {};

        patientDetailsList.forEach((patient) => {
          names[patient.id] = `${patient.first_name} ${patient.last_name}`;
        });

        setDoctors(departmentDoctors);
        setAppointments(filteredAppointments);
        setPatientNames(names);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching nurse appointments");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNurseAppointments();
  }, [nurseId]);

  function getDoctorName(doctorId: number) {
    const doctor = doctors.find((doctor) => doctor.user_id === doctorId);

    if (!doctor) {
      return "Unknown Doctor";
    }

    return `Dr. ${doctor.first_name} ${doctor.last_name}`;
  }

  function getPatientName(patientId: number) {
    return patientNames[patientId] || "Unknown Patient";
  }

  function handleView(id: number) {
    const appointment = appointments.find(
      (appointment) => appointment.id === id,
    );

    if (appointment) {
      setSelectedAppointment(appointment);
    }
  }

  const columns = [
    {
      header: "Doctor",
      render: (appointment: Appointment) =>
        getDoctorName(appointment.doctor_id),
    },
    {
      header: "Patient",
      render: (appointment: Appointment) =>
        getPatientName(appointment.patient_id),
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
          <button onClick={() => handleView(appointment.id)}>View</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading department appointments...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>Department Appointments</h2>

      <DataTable columns={columns} data={appointments} />

      {selectedAppointment && (
        <DetailCard
          title="Selected Appointment Details"
          details={[
            {
              label: "Doctor",
              value: getDoctorName(selectedAppointment.doctor_id),
            },
            {
              label: "Patient",
              value: getPatientName(selectedAppointment.patient_id),
            },
            {
              label: "Date",
              value: new Date(selectedAppointment.appointment_date).toLocaleDateString("en-IN"),
            },
            {
              label: "Start Time",
              value: selectedAppointment.start_time,
            },
            {
              label: "End Time",
              value: selectedAppointment.end_time,
            },
            {
              label: "Status",
              value: selectedAppointment.status,
            },
          ]}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </section>
  );
}

export default NurseAppointments;
