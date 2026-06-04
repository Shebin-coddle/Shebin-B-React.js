import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import { getAllPatients, removePatient } from "../../services/PatientService";
import type { Patient } from "../../types/PatientTypes";
import { getAllUsers } from "../../services/UserService";
import DeleteModal from "../../components/DeleteModal";

function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [userName, setUserName] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();

        const map = Object.fromEntries(
          users.map((u) => [u.id, `${u.first_name} ${u.last_name}`]),
        );

        setUserName(map);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    }

    fetchUsers();
  }, []);

  function openDeleteModal(id: number) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setError("");

      await removePatient(deleteId);

      setPatients((prev) => prev.filter((patient) => patient.user_id !== deleteId));

      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      header: "User ID",
      render: (patient: Patient) => patient.user_id,
    },
    {
      header: "Name",
      render: (patient: Patient) =>
        userName[patient.user_id] || patient.user_id,
    },
    {
      header: "Date of Birth",
      render: (patient: Patient) =>
        new Date(patient.dob).toLocaleDateString("en-IN"),
    },
    {
      header: "Blood Group",
      render: (patient: Patient) => patient.blood_group || "N/A",
    },
    {
      header: "Actions",
      render: (patient: Patient) => (
        <div className="table-actions">
          <button
            onClick={() => navigate(`/admin-patients/edit/${patient.user_id}`)}
          >
            Edit
          </button>
          <button onClick={() => openDeleteModal(patient.user_id)}>
            Delete
          </button>
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
      <DataTable columns={columns} data={patients} />

      <DeleteModal
        open={deleteId !== null}
        title="Delete Patient"
        message="Do you want to continue?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default AdminPatients;
