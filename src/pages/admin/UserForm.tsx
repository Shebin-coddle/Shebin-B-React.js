import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  ChangeEvent,
  SyntheticEvent
} from "react";
import EditForm from "../../components/EditForm";
import type { EditField } from "../../components/EditForm";
import {
  getAllUsers,
  updateUser,
  createUser,
} from "../../services/UserService";

function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  type UserFormData = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role_id: number;
    password: string;
  };

  const [formData, setFormData] =
    useState<UserFormData>({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role_id: 1,
      password: "",
    });

  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        const users = await getAllUsers();

        const user = users.find(
          (u) => u.id === Number(id),
        );

        if (user) {
          setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email ?? "",
            phone: user.phone ?? "",
            role_id: user.role_id,
            password: "",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    load();
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
      [name]:
        name === "role_id"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(
    e: SyntheticEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateUser(Number(id), {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          role_id: formData.role_id,
        });
      } else {
        await createUser(formData);
      }

      navigate("/admin-users");
    } catch (error) {
      console.error(error);
    }
  }

  const fields: EditField[] = [
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
    {
      name: "role_id",
      label: "Role",
      type: "select",
      value: formData.role_id,
      options: [
        {
          label: "Admin",
          value: 1,
        },
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
  ];

  if (!isEdit) {
    fields.push({
      name: "password",
      label: "Password",
      type: "text",
      value: formData.password,
    });
  }

  return (
    <EditForm
      title={
        isEdit
          ? "Edit User"
          : "Add User"
      }
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate("/admin-users")
      }
    />
  );
}

export default UserForm;