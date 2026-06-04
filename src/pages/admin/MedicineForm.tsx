import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditForm from "../../components/EditForm";
import {
  getMedicineById,
  createMedicine,
  updateMedicine,
} from "../../services/MedicineService";
import type { UpdateMedicineRequest } from "../../types/MedicineTypes";

function MedicineForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UpdateMedicineRequest>({
    medicine_name: "",
    description: "",
    stock: 0,
    expiry_date: "",
  });

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    async function loadMedicine() {
      try {
        const response = await getMedicineById(Number(id));

        const medicine = response[0];
        setFormData({
          medicine_name: medicine.medicine_name,
          description: medicine.description,
          stock: medicine.stock,
          expiry_date: medicine.expiry_date.split("T")[0],
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadMedicine();
  }, [id, isEdit]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateMedicine(Number(id), formData);
      } else {
        await createMedicine(formData);
      }

      navigate("/admin-medicines");
    } catch (error) {
      console.error(error);
    }
  }

  const fields = [
    {
      name: "medicine_name",
      label: "Medicine Name",
      type: "text" as const,
      value: formData.medicine_name,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      value: formData.description,
    },
    {
      name: "stock",
      label: "Stock",
      type: "number" as const,
      value: formData.stock,
    },
    {
      name: "expiry_date",
      label: "Expiry Date",
      type: "date" as const,
      value: formData.expiry_date,
    },
  ];

  return (
    <EditForm
      title={isEdit ? "Edit Medicine" : "Add Medicine"}
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin-medicines")}
    />
  );
}

export default MedicineForm;
