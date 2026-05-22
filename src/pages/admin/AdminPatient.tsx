import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import AdminTable from "../../components/table/AdminTable";
import { getAllPatients, updatePatient } from "../../services/PatientService";
import type { Patient, UpdatePatientRequest } from "../../types/PatientTypes";
import DetailCard from "../../components/DetailsView";
import EditForm from "../../components/EditForm";

function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editForm, setEditForm] = useState<UpdatePatientRequest>({
    dob: "",
    blood_group: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchPatients() {
      try {
        const patientData = await getAllPatients();
        setPatients(patientData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching patients");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  function handleView(userId: number) {
    const patient = patients.find((patient) => patient.user_id === userId);

    if (patient) {
      setSelectedPatient(patient);
    }
  }

  function handleEdit(userId: number) {
    const patient = patients.find((patient) => patient.user_id === userId);

    if (patient) {
      setEditingPatient(patient);

      setEditForm({
        dob: patient.dob ? patient.dob.split("T")[0] : "",
        blood_group: patient.blood_group,
      });
    }
  }

  function handleEditChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  async function handleUpdatePatient(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingPatient) {
      return;
    }

    try {
      await updatePatient(editingPatient.user_id, editForm);

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.user_id === editingPatient.user_id
            ? {
                ...patient,
                dob: editForm.dob,
                blood_group: editForm.blood_group,
              }
            : patient,
        ),
      );

      setEditingPatient(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while updating patient");
      }
    }
  }

  const columns = [
    {
      header: "User ID",
      render: (patient: Patient) => patient.user_id,
    },
    {
      header: "Date of Birth",
      render: (patient: Patient) => patient.dob,
    },
    {
      header: "Blood Group",
      render: (patient: Patient) => patient.blood_group || "N/A",
    },
    {
      header: "Actions",
      render: (patient: Patient) => (
        <div className="table-actions">
          <button onClick={() => handleView(patient.user_id)}>View</button>
          <button onClick={() => handleEdit(patient.user_id)}>Edit</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading patients...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>Patients</h2>

      <AdminTable columns={columns} data={patients} />

      {selectedPatient && (
        <DetailCard
          title="Selected Patient Details"
          details={[
            { label: "User ID", value: selectedPatient.user_id },
            { label: "Date of Birth", value: selectedPatient.dob },
            {
              label: "Blood Group",
              value: selectedPatient.blood_group || "N/A",
            },
          ]}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {editingPatient && (
        <EditForm
          title="Edit Patient"
          fields={[
            {
              name: "dob",
              label: "Date of Birth",
              type: "date",
              value: editForm.dob,
            },
            {
              name: "blood_group",
              label: "Blood Group",
              type: "text",
              value: editForm.blood_group || "",
            },
          ]}
          onChange={handleEditChange}
          onSubmit={handleUpdatePatient}
          onCancel={() => setEditingPatient(null)}
        />
      )}
    </section>
  );
}

export default AdminPatients;
