import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { useNavigate } from "react-router-dom";
import {
  getAllDepartments,
  removeDepartment,
} from "../../services/DepartmentService";
import type { Department } from "../../types/DepartmentTypes";
import DeleteModal from "../../components/DeleteModal";


function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const departmentData = await getAllDepartments();
        setDepartments(departmentData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching departments");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDepartments();
  }, []);

  function openDeleteModal(id: number) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setError("");

      await removeDepartment(deleteId);

      setDepartments((prev) =>
        prev.filter((department) => department.id !== deleteId),
      );

      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      header: "ID",
      render: (department: Department) => department.id,
    },
    {
      header: "Department Name",
      render: (department: Department) => department.department_name,
    },
    {
      header: "Contact Number",
      render: (department: Department) => department.contact_number || "N/A",
    },
    {
      header: "Actions",
      render: (department: Department) => (
        <div className="table-actions">
          <button
            onClick={() => navigate(`/admin-departments/edit/${department.id}`)}
          >
            Edit
          </button>
          <button onClick={() => openDeleteModal(department.id)}>Delete</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading departments...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
     <div className="pages-header">
        <h2>Departments</h2>
        <div className="pages-actions">
          <button
            className="add-btn"
            onClick={() => navigate("/admin-departments/add")}
          >
            Add department
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={departments} />

      <DeleteModal
        open={deleteId !== null}
        title="Delete department"
        message="Do you want to continue?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default AdminDepartments;
