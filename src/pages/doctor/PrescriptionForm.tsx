import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getAllMedicines } from "../../services/MedicineService";
import { getPatientDetailsById } from "../../services/PatientService";
import { createFullPrescription } from "../../services/PrescriptionService";

import type { Medicine } from "../../types/MedicineTypes";
import { showSuccess, showError } from "../../utils/toast";

type PrescriptionItemForm = {
  medicine_id: number | "";
  dosage: string;
  start_date: string;
  end_date: string;
};

type CreatePrescriptionForm = {
  patient_id: number | "";
  doctor_id: number;
  items: PrescriptionItemForm[];
};

function PrescriptionForm() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [patientName, setPatientName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreatePrescriptionForm>({
    patient_id: patientId ? Number(patientId) : "",
    doctor_id: Number(localStorage.getItem("user_id")),
    items: [
      {
        medicine_id: "",
        dosage: "",
        start_date: "",
        end_date: "",
      },
    ],
  });

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

  useEffect(() => {
    if (!patientId) return;

    (async () => {
      try {
        const data = await getPatientDetailsById(Number(patientId));
        setPatientName(`${data.first_name} ${data.last_name}`);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [patientId]);

  function handleItemChange(
    index: number,
    field: keyof PrescriptionItemForm,
    value: string,
  ) {
    let updatedValue: string | number = value;

    if (field === "medicine_id") {
      updatedValue = value === "" ? "" : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: updatedValue } : item,
      ),
    }));
  }

  function addItem() {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          medicine_id: "",
          dosage: "",
          start_date: "",
          end_date: "",
        },
      ],
    }));
  }

  function removeItem(index: number) {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function validateForm(): boolean {
    const err: Record<string, string> = {};

    if (!formData.patient_id) {
      err.patient_id = "Patient is required";
    }

    formData.items.forEach((item, index) => {
      if (!item.medicine_id) {
        err[`medicine_id_${index}`] = "Medicine is required";
      }

      if (!item.dosage) {
        err[`dosage_${index}`] = "Dosage is required";
      }

      if (!item.start_date) {
        err[`start_date_${index}`] = "Start date is required";
      }

      if (!item.end_date) {
        err[`end_date_${index}`] = "End date is required";
      }

      if (item.start_date && item.end_date && item.start_date > item.end_date) {
        err[`end_date_${index}`] = "End date must be after start date";
      }
    });

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createFullPrescription({
        patient_id: Number(formData.patient_id),
        doctor_id: formData.doctor_id,
        items: formData.items.map((item) => ({
          medicine_id: Number(item.medicine_id),
          dosage: item.dosage,
          start_date: item.start_date,
          end_date: item.end_date,
        })),
      });

      showSuccess("Prescription created successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      showError("Failed to create prescription");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Prescription</h2>

      <p>
        <strong>Patient:</strong> {patientName}
      </p>

      <h3>Medicines</h3>

      {formData.items.map((item, index) => (
        <div key={`${item.medicine_id}-${index}`} className="card">
          <div className="form-group">
            <label htmlFor={`medicine-${index}`}>Medicine</label>

            <select
              id={`medicine-${index}`}
              value={item.medicine_id}
              onChange={(e) =>
                handleItemChange(index, "medicine_id", e.target.value)
              }
            >
              <option value="">Select Medicine</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.medicine_name}
                </option>
              ))}
            </select>

            {errors[`medicine_id_${index}`] && (
              <p className="field-error">{errors[`medicine_id_${index}`]}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor={`dosage-${index}`}>Dosage</label>
            <input
              id={`dosage-${index}`}
              value={item.dosage}
              onChange={(e) =>
                handleItemChange(index, "dosage", e.target.value)
              }
            />

            {errors[`dosage_${index}`] && (
              <p className="field-error">{errors[`dosage_${index}`]}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor={`start-${index}`}>Start Date</label>
            <input
              id={`start-${index}`}
              type="date"
              value={item.start_date}
              onChange={(e) =>
                handleItemChange(index, "start_date", e.target.value)
              }
            />

            {errors[`start_date_${index}`] && (
              <p className="field-error">{errors[`start_date_${index}`]}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor={`end-${index}`}>End Date</label>
            <input
              id={`end-${index}`}
              type="date"
              value={item.end_date}
              onChange={(e) =>
                handleItemChange(index, "end_date", e.target.value)
              }
            />

            {errors[`end_date_${index}`] && (
              <p className="field-error">{errors[`end_date_${index}`]}</p>
            )}
          </div>

          {formData.items.length > 1 && (
            <button type="button" onClick={() => removeItem(index)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addItem}>
        Add Medicine
      </button>

      <button type="submit">Save Prescription</button>
    </form>
  );
}

export default PrescriptionForm;
