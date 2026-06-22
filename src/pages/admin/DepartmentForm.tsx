import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  ChangeEvent,
  SyntheticEvent,
} from "react";

import EditForm from "../../components/EditForm";
import { showSuccess, showError } from "../../utils/toast";

import {
  getDepartmentById,
  createDepartment,
  updateDepartment,
} from "../../services/DepartmentService";

type DepartmentFormData = {
  department_name: string;
  contact_number: string;
};

function DepartmentForm() {
  const { id } = useParams();
  console.log("id =", id);

  const isEdit = Boolean(id);

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<DepartmentFormData>({
      department_name: "",
      contact_number: "",
    });

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    async function loadDepartment() {
      try {
        const department =
          await getDepartmentById(Number(id));

        setFormData({
          department_name:
            department.department_name,
          contact_number:
            department.contact_number || "",
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadDepartment();
  }, [id, isEdit]);

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
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: SyntheticEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateDepartment(
          Number(id),
          formData,
        );
        showSuccess("Details Updated")
      } else {
        await createDepartment(formData);
        showSuccess("Department added successfully");
      }

      navigate("/admin-departments");
    } catch (error) {
      showError("Operation Unsuccessfull");
      console.error(error);
    }
  }

  const fields = [
    {
      name: "department_name",
      label: "Department Name",
      type: "text" as const,
      value: formData.department_name,
    },
    {
      name: "contact_number",
      label: "Contact Number",
      type: "text" as const,
      value: formData.contact_number,
    },
  ];

  return (
    <EditForm
      title={
        isEdit
          ? "Edit Department"
          : "Add Department"
      }
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate("/admin-departments")
      }
    />
  );
}

export default DepartmentForm;