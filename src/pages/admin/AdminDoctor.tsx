import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import { getAllDoctors, removeDoctor } from "../../services/DoctorService";
import type { Doctor } from "../../types/DoctorTypes";
import { getAllUsers } from "../../services/UserService";
import DeleteModal from "../../components/DeleteModal";

function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [userName, setUserName] = useState<Record<number, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const doctorData = await getAllDoctors();
        setDoctors(doctorData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching doctors");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();

        const map = Object.fromEntries(
          users.map((u) => [u.id, `Dr.${u.first_name} ${u.last_name}`]),
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

      await removeDoctor(deleteId);

      setDoctors((prev) =>
        prev.filter((doctor) => doctor.user_id !== deleteId),
      );

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
      render: (doctor: Doctor) => doctor.user_id,
    },
    {
      header: "Name",
      render: (doctor: Doctor) => userName[doctor.user_id] || doctor.user_id,
    },
    {
      header: "Specialization",
      render: (doctor: Doctor) => doctor.specialization,
    },
    {
      header: "Salary",
      render: (doctor: Doctor) => doctor.salary,
    },
    {
      header: "Department ID",
      render: (doctor: Doctor) => doctor.department_id,
    },
    {
      header: "Actions",
      render: (doctor: Doctor) => (
        <div className="table-actions">
          <button
            onClick={() => navigate(`/admin-doctors/edit/${doctor.user_id}`)}
          >
            Edit
          </button>
          <button onClick={() => openDeleteModal(doctor.user_id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>Doctors</h2>

      <DataTable columns={columns} data={doctors} />

      <DeleteModal
        open={deleteId !== null}
        title="Delete Doctor"
        message="Do you want to continue?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default AdminDoctors;
