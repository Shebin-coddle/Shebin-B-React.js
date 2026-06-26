import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import DetailCard from "../../components/DetailsView";
import { getAllAppointments,updateAppointmentStatus } from "../../services/AppointmentService";
import type { Appointment } from "../../types/AppointmentTypes";
import { getPatientDetailsById } from "../../services/PatientService";
import type { PatientDetails } from "../../types/PatientTypes";
import { getMedicalRecordsByPatientId } from "../../services/MedicalRecordService";
import type { MedicalRecord } from "../../types/MedicalRecordTypes";
import DateSearch from "../../components/DateSearch";
import { getPrescriptionView } from "../../services/PrescriptionService";
import { groupPrescriptions } from "../../utils/prescriptionGroup";
import type {
  PrescriptionItem,
  PrescriptionView,
} from "../../types/PrescriptionTypes";
import { useNavigate } from "react-router-dom";
import { getAllMedicines } from "../../services/MedicineService";
import type { Medicine } from "../../types/MedicineTypes";
import "../../styles/doctorLayout.css";

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
  const [selectedDate, setSelectedDate] = useState("");
  const [prescriptions, setPrescriptions] = useState<PrescriptionView[]>([]);
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);

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

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllMedicines();
        setMedicines(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  async function handleCancel(id: number) {
    try {
      await updateAppointmentStatus(id, "cancelled");

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    }
  }

  async function handleApprove(id: number) {
    try {
      await updateAppointmentStatus(id, "booked");

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "booked" } : a)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed");
    }
  }

  async function handleComplete(id: number) {
    try {
      await updateAppointmentStatus(id, "completed");

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Complete failed");
    }
  }

  async function handleViewPatient(patientId: number) {
    try {
      const patientDetails = await getPatientDetailsById(patientId);
      const records = await getMedicalRecordsByPatientId(patientId);

      const prescriptionRows = await getPrescriptionView(
        patientId,
        Number(userId),
      );

      const grouped = groupPrescriptions(prescriptionRows);

      setSelectedPatient(patientDetails);
      setMedicalRecords(records);

      setPrescriptions(grouped); 
      setShowMedicalRecords(true);
    } catch (err) {
      console.error(err);
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(
      appointment.appointment_date,
    ).toLocaleDateString("en-CA");

    const matchingDate = !selectedDate || appointmentDate === selectedDate;
    const matchingStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    return matchingDate && matchingStatus;
  });

  const columns = [
    {
      header: "Date",
      render: (appointment: Appointment) =>
        new Date(appointment.appointment_date).toLocaleDateString("en-IN"),
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

          <button
            onClick={() =>
              navigate(`/doctor-prescriptions/add/${appointment.patient_id}`)
            }
          >
            Create Prescription
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
      <DateSearch
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onClear={() => setSelectedDate("")}
      />
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
              value: new Date(selectedPatient.dob).toLocaleDateString("en-IN"),
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
        <>
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
                    <strong>Date:</strong>{" "}
                    {new Date(record.diagnosis_date).toLocaleDateString(
                      "en-IN",
                    )}
                  </p>
                </div>
              ))
            )}

            <button
              onClick={() => {
                setShowMedicalRecords(false);
                setMedicalRecords([]);
                setPrescriptions([]);
              }}
            >
              Close
            </button>
          </div>

          <div className="user-detail-card">
            <h3>Prescriptions</h3>

            {prescriptions.length === 0 ? (
              <p>No prescriptions found</p>
            ) : (
              prescriptions.map((p) => (
                <div key={p.id} className="prescription-card">
                  {p.items.length === 0 ? (
                    <p>No items</p>
                  ) : (
                    p.items.map((item: PrescriptionItem) => (
                      <div key={item.id} className="prescription-item">
                        <p>
                          <strong>Medicine Name:</strong>{" "}
                          {
                            medicines.find((m) => m.id === item.medicine_id)
                              ?.medicine_name
                          }
                        </p>
                        <p>
                          <strong>Dosage:</strong> {item.dosage}
                        </p>
                        <p>
                          <strong>Start:</strong>{" "}
                          {new Date(item.start_date).toLocaleDateString(
                            "en-IN",
                          )}
                        </p>
                        <p>
                          <strong>End:</strong>{" "}
                          {new Date(item.end_date).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default DoctorAppointments;
