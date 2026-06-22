import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { useNavigate } from "react-router-dom";
import {
  getAllAppointments,
  removeAppointment,
} from "../../services/AppointmentService";
import type { Appointment } from "../../types/AppointmentTypes";
import { getAllUsers } from "../../services/UserService";
import DeleteModal from "../../components/DeleteModal";

function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [userName, setUserName] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const appointmentData = await getAllAppointments();
        setAppointments(appointmentData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error occurred while fetching appointments",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();

        const map = Object.fromEntries(
          users.map((u) => [u.id, `${u.first_name} ${u.last_name}`]),
        );
        setUserName(map);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    }
    fetchUsers();
  }, []);

  function openDeleteModal(id: number) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setError("");

      await removeAppointment(deleteId);

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== deleteId),
      );

      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const doctorName = (userName[appointment.doctor_id] || "").toLowerCase();

    const patientName = (userName[appointment.patient_id] || "").toLowerCase();

    const search = searchText.toLowerCase();

    const appointmentDate = new Date(
      appointment.appointment_date,
    ).toLocaleDateString("en-CA");

    const matchesSearch =
      doctorName.includes(search) || patientName.includes(search);

    const matchesDate = !selectedDate || appointmentDate === selectedDate;

    return matchesSearch && matchesDate;
  });

  const columns = [
    {
      header: "ID",
      render: (appointment: Appointment) => appointment.id,
    },

    {
      header: "Doctor",
      render: (a: Appointment) => `Dr.${userName[a.doctor_id] || a.doctor_id}`,
    },
    {
      header: "Patient",
      render: (a: Appointment) => userName[a.patient_id] || a.patient_id,
    },

    {
      header: "Date",
      render: (appointment: Appointment) =>
        new Date(appointment.appointment_date).toLocaleDateString("en-IN"),
    },

    {
      header: "Start Time",
      render: (appointment: Appointment) => appointment.start_time,
    },

    {
      header: "End Time",
      render: (appointment: Appointment) => appointment.end_time,
    },

    {
      header: "Status",
      render: (appointment: Appointment) => appointment.status,
    },

    {
      header: "Actions",
      render: (appointment: Appointment) => (
        <div className="table-actions">
          <button
            className="edit-btn"
            onClick={() =>
              navigate(`/admin-appointments/edit/${appointment.id}`)
            }
          >
            Edit
          </button>
          <button onClick={() => openDeleteModal(appointment.id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <div className="pages-header">
        <h2>Appointments</h2>
        <div className="pages-actions">
          <button
            className="add-btn"
            onClick={() => navigate("/admin-appointments/add")}
          >
            Add appointment
          </button>
        </div>
      </div>
      <div className="appointment-filters">
        <div>
          <input
            type="text"
            placeholder="Search by patient/doctor name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setSearchText("");
            setSelectedDate("");
          }}
        >
          Clear Filters
        </button>
      </div>
      <DataTable columns={columns} data={filteredAppointments} />
      <DeleteModal
        open={deleteId !== null}
        title="Delete Appointment"
        message="Do you want to continue?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default AdminAppointments;
