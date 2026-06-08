import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import DetailCard from "../../components/DetailsView";
import { getAllAppointments } from "../../services/AppointmentService";
import type { Appointment } from "../../types/AppointmentTypes";
import { getPatientDetailsById } from "../../services/PatientService";
import type { PatientDetails } from "../../types/PatientTypes";
import {
  approveAppointment,
  cancelAppointment,
  completeAppointment,
} from "../../services/AppointmentService";
import { getMedicalRecordsByPatientId } from "../../services/MedicalRecordService";

import type { MedicalRecord } from "../../types/MedicalRecordTypes";

function DoctorAppointments() {
  const userId = localStorage.getItem("user_id");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [showMedicalRecords, setShowMedicalRecords] = useState<boolean>(false);

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
          setError("Error occurred while fetching doctor appointments");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDoctorAppointments();
  }, [userId]);

  async function handleCancel(id: number) {
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

  async function handleApprove(id: number) {
    try {
      await approveAppointment(id);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "booked",
              }
            : appointment,
        ),
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while approving appointment");
      }
    }
  }

  async function handleComplete(id: number) {
    try {
      await completeAppointment(id);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "completed",
              }
            : appointment,
        ),
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while completing appointment");
      }
    }
  }
  async function handleViewPatient(patientId: number) {
    try {
      const patientDetails = await getPatientDetailsById(patientId);

      const records = await getMedicalRecordsByPatientId(patientId);

      setSelectedPatient(patientDetails);

      setMedicalRecords(records);
      setShowMedicalRecords(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while fetching patient details");
      }
    }
  }
  const filteredAppointments =
    statusFilter === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === statusFilter,
        );
  const columns = [
    {
      header: "Date",
      render: (appointment: Appointment) =>new Date (appointment.appointment_date).toLocaleDateString("en-IN"),
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
          {(appointment.status === "booked" ||
            appointment.status === "pending") && (
            <>
              <button onClick={() => handleApprove(appointment.id)}>
                Approve
              </button>

              <button onClick={() => handleCancel(appointment.id)}>
                Cancel
              </button>
            </>
          )}
          {appointment.status === "booked" && (
            <button onClick={() => handleComplete(appointment.id)}>
              Complete
            </button>
          )}
          <button onClick={() => handleViewPatient(appointment.patient_id)}>
            Patient Details
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading doctor appointments...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>My Appointments</h2>
      <div className="status-filter">
        <button onClick={() => setStatusFilter("all")}>All</button>
        <button onClick={() => setStatusFilter("pending")}>Pending</button>
        <button onClick={() => setStatusFilter("booked")}>Booked</button>
        <button onClick={() => setStatusFilter("completed")}>Completed</button>
        <button onClick={() => setStatusFilter("cancelled")}>Cancelled</button>
      </div>
      <DataTable columns={columns} data={filteredAppointments} />

      
      {selectedPatient && (
        <DetailCard
          title="Selected Patient Details"
          details={[
            {
              label: "Name",
              value: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
            },
            {
              label: "Email",
              value: selectedPatient.email,
            },
            {
              label: "Phone",
              value: selectedPatient.phone,
            },
            {
              label: "Date of Birth",
              value: new Date (selectedPatient.dob).toLocaleDateString("en-IN"),
            },
            {
              label: "Blood Group",
              value: selectedPatient.blood_group,
            },
          ]}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {showMedicalRecords && (
        <div className="user-detail-card">
          <h3>Medical Records</h3>

          {medicalRecords.length === 0 ? (
            <p>No medical records found</p>
          ) : (
            medicalRecords.map((record) => (
              <div key={record.id} className="medical-record-card">
                <p>
                  <strong>Diagnosis:</strong> {record.medical_condition}
                </p>

                <p>
                  <strong>Treatment:</strong> {record.treatment}
                </p>
                <p>
                  <strong>Status:</strong> {record.status}
                </p>

                <p>
                  <strong>Date:</strong> {new Date (record.diagnosis_date).toLocaleDateString("en-IN")}
                </p>
              </div>
            ))
          )}

          <button
            onClick={() => {
              setShowMedicalRecords(false);
              setMedicalRecords([]);
            }}
          >
            Close Medical Records
          </button>
        </div>
      )}
    </section>
  );
}

export default DoctorAppointments;
