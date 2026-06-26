import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import BreadCrumbs from "../../components/BreadCrumps";
import EditForm from "../../components/EditForm";
import Navbar from "../../components/home/NavBar";
import Footer from "../../components/home/Footer";

import {
  createCompleteUser,
  getCompleteUser,
  updateCompleteUser,
} from "../../services/UserService";

import { showSuccess, showError } from "../../utils/toast";
import {
  validateEmail,
  validatePhone,
  validatePincode,
} from "../../utils/validation";

import type { CompleteUserForm } from "../../types/UserTypes";
import type { EditField } from "../../components/EditForm";

function PatientRegistration() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CompleteUserForm>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: 3,
    street_name: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    dob: "",
    blood_group: "",
    specialization: "",
    salary: 0,
    department_id: 0,
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    const numericFields = new Set(["role_id", "salary", "department_id"]);

    let parsedValue: string | number = value;

    if (numericFields.has(name)) {
      if (value === "") {
        parsedValue = 0;
      } else {
        parsedValue = Number(value);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    const requiredFields: Record<string, string> = {
      first_name: "First name is required",
      last_name: "Last name is required",
      email: "Email is required",
      phone: "Phone number is required",
      street_name: "Street name is required",
      city: "City is required",
      district: "District is required",
      state: "State is required",
      dob: "Date of birth is required",
      blood_group: "Blood group is required",
    };

    for (const [key, message] of Object.entries(requiredFields)) {
      const value = (formData as any)[key];
      if (!value || !String(value).trim()) {
        newErrors[key] = message;
      }
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!isEdit && !formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (formData.pincode && !validatePincode(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    } catch {
      showError("Operation unsuccessful");
    }
  }

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
      } catch {
        showError("Failed to load user details");
      }
    }

    loadUser();
  }, [id, isEdit]);

  const passwordField: EditField[] = isEdit
  ? []
  : [
      {
        name: "password",
        label: "Password",
        type: "text" as const,
        value: formData.password,
      },
    ];

  const fields: EditField[] = [
  { name: "user-section", label: "Patient Information", type: "section" },

  { name: "first_name", label: "First Name", type: "text", value: formData.first_name },
  { name: "last_name", label: "Last Name", type: "text", value: formData.last_name },
  { name: "email", label: "Email", type: "text", value: formData.email },
  { name: "phone", label: "Phone", type: "text", value: formData.phone },

  ...passwordField,

  { name: "address-section", label: "Address Information", type: "section" },

  { name: "street_name", label: "Street Name", type: "text", value: formData.street_name },
  { name: "city", label: "City", type: "text", value: formData.city },
  { name: "district", label: "District", type: "text", value: formData.district },
  { name: "state", label: "State", type: "text", value: formData.state },
  { name: "pincode", label: "Pincode", type: "text", value: formData.pincode },

  { name: "patient-section", label: "Patient Details", type: "section" },

  { name: "dob", label: "Date Of Birth", type: "date", value: formData.dob },
  { name: "blood_group", label: "Blood Group", type: "text", value: formData.blood_group },
];
  return (
    <section>
      {!isEdit && <Navbar />}

      <div className="editpatient">
        {!isEdit && <BreadCrumbs />}

        <EditForm
          title={isEdit ? "Edit Details" : "Patient Registration"}
          fields={fields}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin-users")}
        />
      </div>

      <Footer />
    </section>
  );
}

export default PatientRegistration;
