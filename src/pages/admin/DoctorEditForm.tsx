import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditForm from "../../components/EditForm";
import { getAllDoctors, updateDoctor } from "../../services/DoctorService";

type DoctorFormData = {
  specialization: string;
  salary: number;
  department_id: number;
};

function DoctorEditForm() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<DoctorFormData>({
    specialization: "",
    salary: 0,
    department_id: 0,
  });

  useEffect(() => {
    async function loadDoctor() {
      try {
        const doctors = await getAllDoctors();

        const doctor = doctors.find((d) => d.user_id === Number(userId));

        if (doctor) {
          setFormData({
            specialization: doctor.specialization,
            salary: doctor.salary,
            department_id: doctor.department_id,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadDoctor();
  }, [userId]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "salary" || name === "department_id" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await updateDoctor(Number(userId), formData);

      navigate("/admin-doctors");
    } catch (error) {
      console.error(error);
    }
  }

  const fields = [
    {
      name: "specialization",
      label: "Specialization",
      type: "text" as const,
      value: formData.specialization,
    },
    {
      name: "salary",
      label: "Salary",
      type: "number" as const,
      value: formData.salary,
    },
    {
      name: "department_id",
      label: "Department ID",
      type: "number" as const,
      value: formData.department_id,
    },
  ];

  return (
    <EditForm
      title="Edit Doctor"
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin-doctors")}
    />
  );
}

export default DoctorEditForm;
