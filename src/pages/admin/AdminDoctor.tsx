import { useEffect, useState,type ChangeEvent, type SyntheticEvent } from "react";
import AdminTable from "../../components/table/AdminTable";
import { getAllDoctors, updateDoctor } from "../../services/DoctorService";
import type { Doctor, UpdateDoctorRequest } from "../../types/DoctorTypes";
import DetailCard from "../../components/DetailsView";
import EditForm from "../../components/EditForm";

function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [editForm, setEditForm] = useState<UpdateDoctorRequest>({
    specialization: "",
    salary: 0,
    department_id: 0,
  });

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const doctorData = await getAllDoctors();
        setDoctors(doctorData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching doctors");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  function handleView(userId: number) {
    const doctor = doctors.find((doctor) => doctor.user_id === userId);

    if (doctor) {
      setSelectedDoctor(doctor);
    }
  }

  function handleEdit(userId: number) {
    console.log("Edit doctor", userId);
    const doctor = doctors.find((doctor) => doctor.user_id === userId);
    if (doctor) {
      setEditingDoctor(doctor);

      setEditForm({
        specialization: doctor.specialization,
        salary: doctor.salary,
        department_id: doctor.department_id,
      });
    }
  }

 function handleEditChange(
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
    const { name, value } = e.target;

    setEditForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "salary" || name === "department_id" ? Number(value) : value,
    }));
  }

  async function handleUpdateDoctor(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingDoctor) {
      return;
    }

    try {
      await updateDoctor(editingDoctor.user_id, editForm);
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.user_id === editingDoctor.user_id
            ? {
                ...doctor,
                specialization: editForm.specialization,
                salary: editForm.salary,
                department_id: editForm.department_id,
              }
            : doctor,
        ),
      );

      setEditingDoctor(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while updating doctor");
      }
    }
  }

  const columns = [
    {
      header: "User ID",
      render: (doctor: Doctor) => doctor.user_id,
    },
    {
      header: "Specialization",
      render: (doctor: Doctor) => doctor.specialization,
    },
    {
      header: "Salary",
      render: (doctor: Doctor) => doctor.salary,
    },
    {
      header: "Department ID",
      render: (doctor: Doctor) => doctor.department_id,
    },
    {
      header: "Actions",
      render: (doctor: Doctor) => (
        <div className="table-actions">
          <button onClick={() => handleView(doctor.user_id)}>View</button>
          <button onClick={() => handleEdit(doctor.user_id)}>Edit</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>Doctors</h2>

      <AdminTable columns={columns} data={doctors} />

      {selectedDoctor && (
        <DetailCard
          title="Selected Doctor Details"
          details={[
            { label: "User ID", value: selectedDoctor.user_id },
            { label: "Specialization", value: selectedDoctor.specialization },
            { label: "Salary", value: selectedDoctor.salary },
            { label: "Department ID", value: selectedDoctor.department_id },
          ]}
          onClose={() => setSelectedDoctor(null)}
        />
      )}

      {editingDoctor && (
  <EditForm
    title="Edit Doctor"
    fields={[
      {
        name: "specialization",
        label: "Specialization",
        type: "text",
        value: editForm.specialization,
      },
      {
        name: "salary",
        label: "Salary",
        type: "number",
        value: editForm.salary,
      },
      {
        name: "department_id",
        label: "Department ID",
        type: "number",
        value: editForm.department_id,
      },
    ]}
    onChange={handleEditChange}
    onSubmit={handleUpdateDoctor}
    onCancel={() => setEditingDoctor(null)}
  />
)}
    </section>
  );
}

export default AdminDoctors;
