import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditForm from "../../components/EditForm";
import { getAllPatients, updatePatient } from "../../services/PatientService";

type PatientFormData = {
  dob: string;
  blood_group: string;
};

function PatientEditForm() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PatientFormData>({
    dob: "",
    blood_group: "",
  });

  useEffect(() => {
    async function loadPatient() {
      try {
        const patients = await getAllPatients();

        const patient = patients.find((p) => p.user_id === Number(userId));

        if (patient) {
          setFormData({
            dob: patient.dob
              ? new Date(patient.dob).toISOString().split("T")[0]
              : "",
            blood_group: patient.blood_group || "",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadPatient();
  }, [userId]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await updatePatient(Number(userId), formData);

      navigate("/admin-patients");
    } catch (error) {
      console.error(error);
    }
  }

  const fields = [
    {
      name: "dob",
      label: "Date of Birth",
      type: "date" as const,
      value: formData.dob,
    },
    {
      name: "blood_group",
      label: "Blood Group",
      type: "text" as const,
      value: formData.blood_group,
    },
  ];

  return (
    <EditForm
      title="Edit Patient"
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin-patients")}
    />
  );
}

export default PatientEditForm;
