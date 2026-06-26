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

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    async function fetchNurseAppointments() {
      try {
        const nurseData: Nurse = await getNurseById(nurseId);
        const doctorData = await getDoctorsWithDetails();
        const appointmentData = await getAllAppointments();

        const departmentDoctors = doctorData.filter(
          (doctor) => doctor.department_id === nurseData.department_id,
        );

        const departmentDoctorIds = new Set(
          departmentDoctors.map((doctor) => doctor.user_id),
        );

        const filteredAppointments = appointmentData.filter((appointment) =>
          departmentDoctorIds.has(appointment.doctor_id),
        );

        const uniquePatientIds = [
          ...new Set(filteredAppointments.map((a) => a.patient_id)),
        ];

        const patientDetailsList = await Promise.all(
          uniquePatientIds.map((id) => getPatientDetailsById(id)),
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
    const doctor = doctors.find((d) => d.user_id === doctorId);
    return doctor
      ? `Dr. ${doctor.first_name} ${doctor.last_name}`
      : "Unknown Doctor";
  }

  function getPatientName(patientId: number) {
    return patientNames[patientId] || "Unknown Patient";
  }

  function handleView(id: number) {
    const appointment = appointments.find((a) => a.id === id);
    if (appointment) setSelectedAppointment(appointment);
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(
      appointment.appointment_date,
    ).toLocaleDateString("en-CA");

    const matchesDate = !selectedDate || appointmentDate === selectedDate;

    const matchesStatus =
      !selectedStatus || appointment.status === selectedStatus;

    return matchesDate && matchesStatus;
  });

  const columns = [
    {
      header: "Doctor",
      render: (a: Appointment) => getDoctorName(a.doctor_id),
    },
    {
      header: "Patient",
      render: (a: Appointment) => getPatientName(a.patient_id),
    },
    {
      header: "Date",
      render: (a: Appointment) =>
        new Date(a.appointment_date).toLocaleDateString("en-IN"),
    },
    {
      header: "Start Time",
      render: (a: Appointment) => a.start_time,
    },
    {
      header: "End Time",
      render: (a: Appointment) => a.end_time,
    },
    {
      header: "Status",
      render: (a: Appointment) => a.status,
    },
    {
      header: "Actions",
      render: (a: Appointment) => (
        <div className="table-actions">
          <button onClick={() => handleView(a.id)}>View</button>
        </div>
      ),
    },
  ];

  if (loading) return <p>Loading department appointments...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>Department Appointments</h2>

      <div className="appointment-filters">
        <div>
          <label htmlFor="dateFilter">Date</label>
          <input
            id="dateFilter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="booked">Booked</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedDate("");
            setSelectedStatus("");
          }}
        >
          Clear Filters
        </button>
      </div>

      <DataTable columns={columns} data={filteredAppointments} />

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
              value: new Date(
                selectedAppointment.appointment_date,
              ).toLocaleDateString("en-IN"),
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
