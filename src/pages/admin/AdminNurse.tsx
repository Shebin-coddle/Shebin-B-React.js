import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import AdminTable from "../../components/table/AdminTable";
import { getAllNurses, updateNurse } from "../../services/NurseService";
import type { Nurse, UpdateNurseRequest } from "../../types/NurseTypes";
import DetailCard from "../../components/DetailsView";
import EditForm from "../../components/EditForm";

function AdminNurses() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);
  const [editForm, setEditForm] = useState<UpdateNurseRequest>({
    salary: 0,
    department_id: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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

  function handleView(userId: number) {
    const nurse = nurses.find((nurse) => nurse.user_id === userId);

    if (nurse) {
      setSelectedNurse(nurse);
    }
  }

  function handleEdit(userId: number) {
    const nurse = nurses.find((nurse) => nurse.user_id === userId);

    if (nurse) {
      setEditingNurse(nurse);

      setEditForm({
        salary: nurse.salary,
        department_id: nurse.department_id,
      });
    }
  }

  function handleEditChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: Number(value),
    }));
  }

  async function handleUpdateNurse(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingNurse) {
      return;
    }

    try {
      await updateNurse(editingNurse.user_id, editForm);

      setNurses((prevNurses) =>
        prevNurses.map((nurse) =>
          nurse.user_id === editingNurse.user_id
            ? {
                ...nurse,
                salary: editForm.salary,
                department_id: editForm.department_id,
              }
            : nurse,
        ),
      );

      setEditingNurse(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while updating nurse");
      }
    }
  }

  const columns = [
    {
      header: "User ID",
      render: (nurse: Nurse) => nurse.user_id,
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
          <button onClick={() => handleView(nurse.user_id)}>View</button>
          <button onClick={() => handleEdit(nurse.user_id)}>Edit</button>
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

      <AdminTable columns={columns} data={nurses} />

      {selectedNurse && (
        <DetailCard
          title="Selected Nurse Details"
          details={[
            { label: "User ID", value: selectedNurse.user_id },
            { label: "Salary", value: selectedNurse.salary },
            { label: "Department ID", value: selectedNurse.department_id },
          ]}
          onClose={() => setSelectedNurse(null)}
        />
      )}

      {editingNurse && (
        <EditForm
          title="Edit Nurse"
          fields={[
            {
              name: "salary",
              label: "Salary",
              type: "number",
              value: editForm.salary,
            },
            {
              name: "department_id",
              label: "Department ID",
              type: "number",
              value: editForm.department_id,
            },
          ]}
          onChange={handleEditChange}
          onSubmit={handleUpdateNurse}
          onCancel={() => setEditingNurse(null)}
        />
      )}
    </section>
  );
}

export default AdminNurses;
