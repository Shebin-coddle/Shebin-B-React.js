import { useEffect, useState,type ChangeEvent, type SyntheticEvent } from "react";
import AdminTable from "../../components/table/AdminTable";
import type { User, UpdateUserRequest } from "../../types/UserTypes";
import DetailCard from "../../components/DetailsView";
import EditForm from "../../components/EditForm";
import {
  getAllUsers,
  updateUser,
} from "../../services/UserService";
import SearchInput from "../../components/SearchInput";

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserRequest>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    role_id: 1,
  });
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userData = await getAllUsers();
        setUsers(userData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching users");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  function handleView(id: number) {
    console.log("View user", id);
    const user = users.find((user) => user.id === id);
    if (user) {
      setSelectedUser(user);
    }
  }

  function handleEdit(id: number) {
    const user = users.find((user) => user.id === id);

    if (user) {
      setEditingUser(user);

      setEditForm({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        role_id: user.role_id,
      });
    }
  }

  function handleEditChange(
    e:  ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: name === "role_id" ? Number(value) : value,
    }));
  }

 

  async function handleUpdateUser(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingUser) {
      return;
    }

    try {
      await updateUser(editingUser.id, editForm);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                first_name: editForm.first_name,
                last_name: editForm.last_name,
                email: editForm.email,
                phone: editForm.phone,
                role_id: editForm.role_id,
              }
            : user,
        ),
      );

      setEditingUser(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while updating user");
      }
    }
  }

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email?.toLowerCase() || "";
    const search = searchText.toLowerCase();

    return fullName.includes(search) || email.includes(search);
  });

  const columns = [
    {
      header: "ID",
      render: (user: User) => user.id,
    },
    {
      header: "Name",
      render: (user: User) => `${user.first_name} ${user.last_name}`,
    },
    {
      header: "Email",
      render: (user: User) => user.email || "N/A",
    },
    {
      header: "Phone",
      render: (user: User) => user.phone || "N/A",
    },
    {
      header: "Role ID",
      render: (user: User) => user.role_id,
    },
    {
      header: "Actions",
      render: (user: User) => (
        <div className="table-actions">
          <button onClick={() => handleView(user.id)}>View</button>
          <button onClick={() => handleEdit(user.id)}>Edit</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>Users</h2>
      <SearchInput
        value={searchText}
        onChange={setSearchText}
        placeholder="Search users by name or email"
      />

      <AdminTable columns={columns} data={filteredUsers} />
      {selectedUser && (
        <DetailCard
          title="Selected User Details"
          details={[
            {
              label: "Name",
              value: `${selectedUser.first_name} ${selectedUser.last_name}`,
            },
            {
              label: "Email",
              value: selectedUser.email,
            },
            {
              label: "Phone",
              value: selectedUser.phone,
            },
            {
              label: "Role ID",
              value: selectedUser.role_id,
            },
          ]}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {editingUser && (
  <EditForm
    title="Edit User"
    fields={[
      {
        name: "first_name",
        label: "First Name",
        type: "text",
        value: editForm.first_name,
      },
      {
        name: "last_name",
        label: "Last Name",
        type: "text",
        value: editForm.last_name,
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        value: editForm.email || "",
      },
      {
        name: "phone",
        label: "Phone",
        type: "text",
        value: editForm.phone || "",
      },
      {
        name: "role_id",
        label: "Role",
        type: "select",
        value: editForm.role_id,
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
    ]}
    onChange={handleEditChange}
    onSubmit={handleUpdateUser}
    onCancel={() => setEditingUser(null)}
  />
)}
    </section>
  );
}

export default AdminUsers;
