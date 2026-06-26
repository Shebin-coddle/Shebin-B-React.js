import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import type { User } from "../../types/UserTypes";
import DeleteModal from "../../components/DeleteModal";

import { getAllUsers, removeUser } from "../../services/UserService";
import SearchInput from "../../components/SearchInput";
import "../../styles/deleteModal.css";
import "../../styles/userHeader.css";

function getRoleName(roleId: number): string {
  switch (roleId) {
    case 1:
      return "Admin";
    case 2:
      return "Doctor";
    case 3:
      return "Patient";
    case 4:
      return "Nurse";
    default:
      return "";
  }
}

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [searchText, setSearchText] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userData = await getAllUsers();
        setUsers(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  function openDeleteModal(id: number) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (deleteId === null) return;

    try {
      setDeleting(true);
      setError("");

      await removeUser(deleteId);

      setUsers((prev) => prev.filter((user) => user.id !== deleteId));

      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
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
      header: "Role",
      render: (user: User) => getRoleName(user.role_id),
    },
    {
      header: "Actions",
      render: (user: User) => (
        <div className="table-actions">
          <button onClick={() => navigate(`/admin-users/edit/${user.id}`)}>
            Edit
          </button>

          <button onClick={() => openDeleteModal(user.id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <div className="users-header">
        <h2>Users</h2>

        <div className="users-actions">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search users by name or email"
          />

          <button
            className="add-user-btn"
            onClick={() => navigate("/admin-users/add")}
          >
            Add User
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredUsers} />

      <DeleteModal
        open={deleteId !== null}
        title="Delete User"
        message="This action cannot be undone. Do you want to continue?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default AdminUsers;