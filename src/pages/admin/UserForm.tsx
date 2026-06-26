import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditForm from "../../components/EditForm";

import {
  createCompleteUser,
  getCompleteUser,
  updateCompleteUser,
} from "../../services/UserService";

import { getAllDepartments } from "../../services/DepartmentService";
import { showSuccess, showError } from "../../utils/toast";

import type { Department } from "../../types/DepartmentTypes";
import type { CompleteUserForm } from "../../types/UserTypes";
import type { EditField } from "../../components/EditForm";

import {
  validateRequired,
  validatePattern,
} from "../../utils/validation";

type ErrorMap = Record<string, string>;

function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [errors, setErrors] = useState<ErrorMap>({});
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    const numericFields = new Set([
      "role_id",
      "salary",
      "department_id",
    ]);

    const parsedValue =
      numericFields.has(name) && value !== "" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  }

  function validateRole(errors: ErrorMap) {
    const role = formData.role_id;

    const needsSalaryDept = role === 2 || role === 4;

    if (role === 2) {
      if (!formData.specialization?.trim()) {
        errors.specialization = "Specialization is required";
      }
    }

    if (role === 3) {
      if (!formData.dob) {
        errors.dob = "Date of birth is required";
      }

      if (!formData.blood_group?.trim()) {
        errors.blood_group = "Blood group is required";
      }
    }

    if (needsSalaryDept) {
      if (!formData.salary || formData.salary <= 0) {
        errors.salary = "Salary must be greater than 0";
      }

      if (!formData.department_id) {
        errors.department_id = "Department is required";
      }
    }
  }


  function validateForm(): boolean {
   const errors: ErrorMap = {};

validateRequired(formData.first_name, "First name is required", "first_name", errors);
validateRequired(formData.last_name, "Last name is required", "last_name", errors);

const email = formData.email.trim();
if (email === "") {
  errors.email = "Email is required";
} else {
  validatePattern(
    email,
    /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/,
    "Invalid email",
    "email",
    errors
  );
}

const phone = formData.phone.trim();
if (phone === "") {
  errors.phone = "Phone number is required";
} else {
  validatePattern(
    phone,
    /^\d{10}$/,
    "Phone number must be 10 digits",
    "phone",
    errors
  );
}

    if (!isEdit) {
      if (!formData.password.trim()) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    validateRequired(formData.street_name, "Street name is required", "street_name", errors);
    validateRequired(formData.city, "City is required", "city", errors);
    validateRequired(formData.district, "District is required", "district", errors);
    validateRequired(formData.state, "State is required", "state", errors);

    validatePattern(formData.pincode, /^\d{6}$/, "Pincode must be 6 digits", "pincode", errors);

    validateRole(errors);

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }


  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEdit && id) {
        await updateCompleteUser(Number(id), formData);
        showSuccess("Details Updated");
      } else {
        await createCompleteUser(formData);
        showSuccess("User added successfully");
      }

      navigate("/admin-users");
    } catch (error) {
      console.error(error);
      showError("Operation unsuccessful");
    }
  }

  const roleFields: EditField[] = [];

  if (formData.role_id === 2) {
    roleFields.push(
      { name: "doctor-section", label: "Doctor Details", type: "section" },
      { name: "specialization", label: "Specialization", type: "text", value: formData.specialization },
      { name: "salary", label: "Salary", type: "number", value: formData.salary },
      {
        name: "department_id",
        label: "Department",
        type: "select",
        value: formData.department_id,
        options: [
          { label: "Select Department", value: 0 },
          ...departments.map((d) => ({
            label: d.department_name,
            value: d.id,
          })),
        ],
      }
    );
  }

  if (formData.role_id === 3) {
    roleFields.push(
      { name: "patient-section", label: "Patient Details", type: "section" },
      { name: "dob", label: "Date Of Birth", type: "date", value: formData.dob },
      { name: "blood_group", label: "Blood Group", type: "text", value: formData.blood_group }
    );
  }

  if (formData.role_id === 4) {
    roleFields.push(
      { name: "nurse-section", label: "Nurse Details", type: "section" },
      { name: "salary", label: "Salary", type: "number", value: formData.salary },
      {
        name: "department_id",
        label: "Department",
        type: "select",
        value: formData.department_id,
        options: [
          { label: "Select Department", value: 0 },
          ...departments.map((d) => ({
            label: d.department_name,
            value: d.id,
          })),
        ],
      }
    );
  }

  const passwordField: EditField[] = [];

if (!isEdit) {
  passwordField.push({
    name: "password",
    label: "Password",
    type: "text",
    value: formData.password,
  });
}

const fields: EditField[] = [
  { name: "user-section", label: "User Information", type: "section" },

  { name: "first_name", label: "First Name", type: "text", value: formData.first_name },
  { name: "last_name", label: "Last Name", type: "text", value: formData.last_name },
  { name: "email", label: "Email", type: "text", value: formData.email },
  { name: "phone", label: "Phone", type: "text", value: formData.phone },

  ...passwordField,

  {
    name: "role_id",
    label: "Role",
    type: "select",
    value: formData.role_id,
    options: [
      { label: "Doctor", value: 2 },
      { label: "Patient", value: 3 },
      { label: "Nurse", value: 4 },
    ],
  },

  { name: "address-section", label: "Address Information", type: "section" },

  { name: "street_name", label: "Street Name", type: "text", value: formData.street_name },
  { name: "city", label: "City", type: "text", value: formData.city },
  { name: "district", label: "District", type: "text", value: formData.district },
  { name: "state", label: "State", type: "text", value: formData.state },
  { name: "pincode", label: "Pincode", type: "text", value: formData.pincode },

  ...roleFields,
];

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