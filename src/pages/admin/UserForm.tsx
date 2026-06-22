import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ChangeEvent, SyntheticEvent } from "react";

import EditForm from "../../components/EditForm";
import type { EditField } from "../../components/EditForm";

import {
  createCompleteUser,
  getCompleteUser,
  updateCompleteUser,
} from "../../services/UserService";

import { getAllDepartments } from "../../services/DepartmentService";
import { showSuccess, showError } from "../../utils/toast";
import type { Department } from "../../types/DepartmentTypes";
import type { CompleteUserForm } from "../../types/UserTypes";

function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<Department[]>([]);

  const [formData, setFormData] = useState<CompleteUserForm>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: 2,

    street_name: "",
    city: "",
    district: "",
    state: "",
    pincode: "",

    specialization: "",
    salary: 0,
    department_id: 0,

    dob: "",
    blood_group: "",
  });

  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getAllDepartments();
        setDepartments(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadDepartments();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;

    async function loadUser() {
      try {
        const user = await getCompleteUser(Number(id));

        console.log(user);

        setFormData({
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          password: "",
          role_id: user.role_id,

          street_name: user.street_name ?? "",
          city: user.city ?? "",
          district: user.district ?? "",
          state: user.state ?? "",
          pincode: user.pincode ?? "",

          specialization: user.specialization ?? "",

          salary: user.doctor_salary ?? user.nurse_salary ?? 0,

          department_id:
            user.doctor_department_id ?? user.nurse_department_id ?? 0,

          dob: user.dob ? user.dob.split("T")[0] : "",
          blood_group: user.blood_group ?? "",
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, [id, isEdit]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "role_id" || name === "salary" || name === "department_id"
          ? Number(value)
          : value,
    }));
  }

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

   

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!isEdit && !formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!isEdit && formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.street_name.trim()) {
      newErrors.street_name = "Street name is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (formData.role_id === 2) {
      if (!formData.specialization?.trim()) {
        newErrors.specialization = "Specialization is required";
      }

      if (formData.salary === undefined || formData.salary <= 0) {
        newErrors.salary = "Salary must be greater than 0";
      }

      if (!formData.department_id) {
        newErrors.department_id = "Department is required";
      }
    }

    if (formData.role_id === 3) {
      if (!formData.dob) {
        newErrors.dob = "Date of birth is required";
      }

      if (!formData.blood_group?.trim()) {
        newErrors.blood_group = "Blood group is required";
      }
    }

    if (formData.role_id === 4) {
      if (formData.salary === undefined || formData.salary <= 0) {
        newErrors.salary = "Salary must be greater than 0";
      }
      if (!formData.department_id) {
        newErrors.department_id = "Department is required";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit && id) {
        await updateCompleteUser(Number(id), formData);
showSuccess("Details Updated")
      } else {
        await createCompleteUser(formData);
        showSuccess("User added successfully")
      }

     
    } catch (error) {
      showError("Opertion unsuccessfull")
      console.error(error);
    }
  }

  const fields: EditField[] = [
    {
      name: "user-section",
      label: "User Information",
      type: "section",
    },

    {
      name: "first_name",
      label: "First Name",
      type: "text",
      value: formData.first_name,
    },

    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      value: formData.last_name,
    },

    {
      name: "email",
      label: "Email",
      type: "text",
      value: formData.email,
    },

    {
      name: "phone",
      label: "Phone",
      type: "text",
      value: formData.phone,
    },
    ...(!isEdit
      ? [
          {
            name: "password",
            label: "Password",
            type: "text" as const,
            value: formData.password,
          },
        ]
      : []),

    {
      name: "role_id",
      label: "Role",
      type: "select",
      value: formData.role_id,
      options: [
        {
          label: "Doctor",
          value: 2,
        },
        {
          label: "Patient",
          value: 3,
        },
        {
          label: "Nurse",
          value: 4,
        },
      ],
    },

    {
      name: "address-section",
      label: "Address Information",
      type: "section",
    },

    {
      name: "street_name",
      label: "Street Name",
      type: "text",
      value: formData.street_name,
    },

    {
      name: "city",
      label: "City",
      type: "text",
      value: formData.city,
    },

    {
      name: "district",
      label: "District",
      type: "text",
      value: formData.district,
    },

    {
      name: "state",
      label: "State",
      type: "text",
      value: formData.state,
    },

    {
      name: "pincode",
      label: "Pincode",
      type: "text",
      value: formData.pincode,
    },
  ];

  if (formData.role_id === 2) {
    fields.push(
      {
        name: "doctor-section",
        label: "Doctor Details",
        type: "section",
      },

      {
        name: "specialization",
        label: "Specialization",
        type: "text",
        value: formData.specialization ?? "",
      },

      {
        name: "salary",
        label: "Salary",
        type: "number",
        value: formData.salary ?? 0,
      },

      {
        name: "department_id",
        label: "Department",
        type: "select",
        value: formData.department_id ?? 0,
        options: [
      {label:"Select Department", value:0},
          ...departments.map((dept) => ({
          label: dept.department_name,
          value: dept.id,
        })),]
      },
    );
  }

  if (formData.role_id === 3) {
    fields.push(
      {
        name: "patient-section",
        label: "Patient Details",
        type: "section",
      },

      {
        name: "dob",
        label: "Date Of Birth",
        type: "date",
        value: formData.dob ?? "",
      },

      {
        name: "blood_group",
        label: "Blood Group",
        type: "text",
        value: formData.blood_group ?? "",
      },
    );
  }

  if (formData.role_id === 4) {
    fields.push(
      {
        name: "nurse-section",
        label: "Nurse Details",
        type: "section",
      },

      {
        name: "salary",
        label: "Salary",
        type: "number",
        value: formData.salary ?? 0,
      },

      {
        name: "department_id",
        label: "Department",
        type: "select",
        value: formData.department_id ?? 0,
          
        options: [
          {label:"Select department", value:0},
          ...departments.map((dept) => ({
          label: dept.department_name,
          value: dept.id,
        })),]
      },
    );
  }

  return (
    <EditForm
      title={isEdit ? "Edit User" : "Add User"}
      fields={fields}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin-users")}
    />
  );
}

export default UserForm;
