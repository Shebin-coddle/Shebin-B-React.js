import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditForm from "../../components/EditForm";
import {
  getAllNurses,
  updateNurse,
  
} from "../../services/NurseService";

type NurseFormData = {
  salary: number;
  department_id: number;
};

function NurseEditForm() {
  const { userId  } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NurseFormData>({
    salary: 0,
    department_id: 0,
  });

  useEffect(() => {
    async function loadNurse() {
      try {
        const nurses = await getAllNurses();

        const nurse = nurses.find(
          (n) => n.user_id === Number(userId ),
        );

        if (nurse) {
          setFormData({
            salary: nurse.salary,
            department_id: nurse.department_id,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadNurse();
  }, [userId ]);

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  async function handleSubmit(
    e: SyntheticEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    try {
      await updateNurse(Number(userId ), formData);

      navigate("/admin-nurses");
    } catch (error) {
      console.error(error);
    }
  }

  const fields = [
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
      title="Edit Nurse"
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin-nurses")}
    />
  );
}

export default NurseEditForm;