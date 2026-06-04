import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { getAllNurses, removeNurse } from "../../services/NurseService";
import type { Nurse } from "../../types/NurseTypes";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/UserService";
import DeleteModal from "../../components/DeleteModal";

function AdminNurses() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [userName, setUserName] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchNurses() {
      try {
        const nurseData = await getAllNurses();
        setNurses(nurseData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching nurses");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNurses();
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

      await removeNurse(deleteId);

      setNurses((prev) => prev.filter((nurse) => nurse.user_id !== deleteId));

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
      render: (nurse: Nurse) => nurse.user_id,
    },

    {
      header: "Name",
      render: (nurse: Nurse) => userName[nurse.user_id] || nurse.user_id,
    },

    {
      header: "Salary",
      render: (nurse: Nurse) => nurse.salary,
    },
    {
      header: "Department ID",
      render: (nurse: Nurse) => nurse.department_id,
    },
    {
      header: "Actions",
      render: (nurse: Nurse) => (
        <div className="table-actions">
          <button
            onClick={() => navigate(`/admin-nurses/edit/${nurse.user_id}`)}
          >
            Edit
          </button>
          <button onClick={() => openDeleteModal(nurse.user_id)}>Delete</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading nurses...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>Nurses</h2>

      <DataTable columns={columns} data={nurses} />
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

export default AdminNurses;
