import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import { getAllPatients, removePatient } from "../../services/PatientService";
import type { Patient } from "../../types/PatientTypes";
import DeleteModal from "../../components/DeleteModal";
import "../../styles/pagesHeader.css"

  type AdminPatientsProps = {
  userNameMap: Record<number, string>;
};

function AdminPatients({
  userNameMap,
}: AdminPatientsProps)  {

  const [patients, setPatients] = useState<Patient[]>([]);
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
        userNameMap[patient.user_id] || patient.user_id,
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
            onClick={() => navigate(`/admin-users/edit/${patient.user_id}`)}
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
  <div className="pages-header">
    <h2>Patients</h2>

    <div className="pages-actions">
      <button
        className="add-btn"
        onClick={() => navigate("/admin-users/add")}
      >
        Add Patient
      </button>
    </div>
  </div>

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
