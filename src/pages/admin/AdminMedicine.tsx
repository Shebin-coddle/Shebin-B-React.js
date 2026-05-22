import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

import AdminTable from "../../components/table/AdminTable";

import {
  getAllMedicines,
  updateMedicine,
} from "../../services/MedicineService";

import type {
  Medicine,
  UpdateMedicineRequest,
} from "../../types/MedicineTypes";

import DetailCard from "../../components/DetailsView";
import EditForm from "../../components/EditForm";

function AdminMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );

  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const [editForm, setEditForm] = useState<UpdateMedicineRequest>({
    medicine_name: "",
    description: "",
    stock: 0,
    expiry_date: "",
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

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

  function handleView(id: number) {
    const medicine = medicines.find((medicine) => medicine.id === id);

    if (medicine) {
      setSelectedMedicine(medicine);
    }
  }

  function handleEdit(id: number) {
    const medicine = medicines.find((medicine) => medicine.id === id);

    if (medicine) {
      setEditingMedicine(medicine);

      setEditForm({
        medicine_name: medicine.medicine_name,

        description: medicine.description,

        stock: medicine.stock,

        expiry_date: medicine.expiry_date.split("T")[0],
      });
    }
  }

  function handleEditChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setEditForm((prevForm) => ({
      ...prevForm,

      [name]: name === "stock" ? Number(value) : value,
    }));
  }

  async function handleUpdateMedicine(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingMedicine) {
      return;
    }

    try {
      await updateMedicine(editingMedicine.id, editForm);

      setMedicines((prevMedicines) =>
        prevMedicines.map((medicine) =>
          medicine.id === editingMedicine.id
            ? {
                ...medicine,

                medicine_name: editForm.medicine_name,

                description: editForm.description,

                stock: editForm.stock,

                expiry_date: editForm.expiry_date,
              }
            : medicine,
        ),
      );

      setEditingMedicine(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while updating medicine");
      }
    }
  }

  const columns = [
    {
      header: "ID",
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
      render: (medicine: Medicine) => medicine.expiry_date,
    },

    {
      header: "Actions",
      render: (medicine: Medicine) => (
        <div className="table-actions">
          <button onClick={() => handleView(medicine.id)}>View</button>

          <button onClick={() => handleEdit(medicine.id)}>Edit</button>
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
      <h2>Medicines</h2>

      <AdminTable columns={columns} data={medicines} />

      {selectedMedicine && (
        <DetailCard
          title="Selected Medicine Details"
          details={[
            {
              label: "ID",
              value: selectedMedicine.id,
            },
            {
              label: "Name",
              value: selectedMedicine.medicine_name,
            },
            {
              label: "Description",
              value: selectedMedicine.description,
            },
            {
              label: "Stock",
              value: selectedMedicine.stock,
            },
            {
              label: "Expiry Date",
              value: selectedMedicine.expiry_date,
            },
          ]}
          onClose={() => setSelectedMedicine(null)}
        />
      )}
      {editingMedicine && (
        <EditForm
          title="Edit Medicine"
          fields={[
            {
              name: "medicine_name",
              label: "Medicine Name",
              type: "text",
              value: editForm.medicine_name,
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              value: editForm.description,
            },
            {
              name: "stock",
              label: "Stock",
              type: "number",
              value: editForm.stock,
            },
            {
              name: "expiry_date",
              label: "Expiry Date",
              type: "date",
              value: editForm.expiry_date,
            },
          ]}
          onChange={handleEditChange}
          onSubmit={handleUpdateMedicine}
          onCancel={() => setEditingMedicine(null)}
        />
      )}
    </section>
  );
}

export default AdminMedicines;
