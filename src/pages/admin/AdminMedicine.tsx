import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import {
  getAllMedicines,
  removeMedicine,
} from "../../services/MedicineService";
import type { Medicine } from "../../types/MedicineTypes";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../components/DeleteModal";


function AdminMedicines() {
  
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchMedicines() {
      try {
        const medicineData = await getAllMedicines();
        setMedicines(medicineData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching medicines");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMedicines();
  }, []);

  function openDeleteModal(id: number) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setError("");

      await removeMedicine(deleteId);

      setMedicines((prev) =>
        prev.filter((medicine) => medicine.id !== deleteId),
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
      header: "Batch ID",
      render: (medicine: Medicine) => medicine.id,
    },
    {
      header: "Medicine Name",
      render: (medicine: Medicine) => medicine.medicine_name,
    },
    {
      header: "Stock",
      render: (medicine: Medicine) => medicine.stock,
    },
    {
      header: "Expiry Date",
      render: (medicine: Medicine) =>
        new Date(medicine.expiry_date).toLocaleDateString("en-IN"),
    },
    {
      header: "Actions",
      render: (medicine: Medicine) => (
        <div className="table-actions">
          <button onClick={(
            
          ) => navigate(`/admin-medicines/edit/${medicine.id}`)}>Edit</button>
          <button onClick={() => openDeleteModal(medicine.id)}>Delete</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading medicines...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <div className="pages-header">
        <h2>Medicines</h2>
        <div className="pages-actions">
          <button
            className="add-btn"
            onClick={() => navigate("/admin-medicines/add")}
          >
            Add medicine
          </button>
        </div>
      </div>
      <DataTable columns={columns} data={medicines} />
      <DeleteModal
        open={deleteId !== null}
        title="Delete Medicine"
        message="Do you want to continue?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default AdminMedicines;
