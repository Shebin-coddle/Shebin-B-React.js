import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import AdminTable from "../../components/table/AdminTable";
import {
  getAllDepartments,
  updateDepartment,
} from "../../services/DepartmentService";
import type {
  Department,
  UpdateDepartmentRequest,
} from "../../types/DepartmentTypes";
import DetailCard from "../../components/DetailsView";
import EditForm from "../../components/EditForm";

function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [editForm, setEditForm] = useState<UpdateDepartmentRequest>({
    department_name: "",
    contact_number: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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

  function handleView(id: number) {
    const department = departments.find((department) => department.id === id);

    if (department) {
      setSelectedDepartment(department);
    }
  }

  function handleEdit(id: number) {
    const department = departments.find((department) => department.id === id);

    if (department) {
      setEditingDepartment(department);

      setEditForm({
        department_name: department.department_name,
        contact_number: department.contact_number,
      });
    }
  }

  function handleEditChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  async function handleUpdateDepartment(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingDepartment) {
      return;
    }

    try {
      await updateDepartment(editingDepartment.id, editForm);

      setDepartments((prevDepartments) =>
        prevDepartments.map((department) =>
          department.id === editingDepartment.id
            ? {
                ...department,
                department_name: editForm.department_name,
                contact_number: editForm.contact_number,
              }
            : department,
        ),
      );

      setEditingDepartment(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while updating department");
      }
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
          <button onClick={() => handleView(department.id)}>View</button>
          <button onClick={() => handleEdit(department.id)}>Edit</button>
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
      <h2>Departments</h2>

      <AdminTable columns={columns} data={departments} />

      {selectedDepartment && (
        <DetailCard
          title="Selected Department Details"
          details={[
            {
              label: "ID",
              value: selectedDepartment.id,
            },
            {
              label: "Department Name",
              value: selectedDepartment.department_name,
            },
            {
              label: "Contact Number",
              value: selectedDepartment.contact_number,
            },
          ]}
          onClose={() => setSelectedDepartment(null)}
        />
      )}

      {editingDepartment && (
        <EditForm
          title="Edit Department"
          fields={[
            {
              name: "department_name",
              label: "Department Name",
              type: "text",
              value: editForm.department_name,
            },
            {
              name: "contact_number",
              label: "Contact Number",
              type: "text",
              value: editForm.contact_number || "",
            },
          ]}
          onChange={handleEditChange}
          onSubmit={handleUpdateDepartment}
          onCancel={() => setEditingDepartment(null)}
        />
      )}
    </section>
  );
}

export default AdminDepartments;
