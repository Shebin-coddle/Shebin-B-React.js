import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

import AdminTable from "../../components/table/AdminTable";

import {
  getAllAppointments,
  updateAppointment,
} from "../../services/AppointmentService";

import type {
  Appointment,
  UpdateAppointmentRequest,
} from "../../types/AppointmentTypes";
import DetailCard from "../../components/DetailsView";
import EditForm from "../../components/EditForm";

function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [editForm, setEditForm] = useState<UpdateAppointmentRequest>({
    appointment_date: "",
    start_time: "",
    end_time: "",
    status: "",
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const appointmentData = await getAllAppointments();

        setAppointments(appointmentData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching appointments");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  function handleView(id: number) {
    const appointment = appointments.find(
      (appointment) => appointment.id === id,
    );

    if (appointment) {
      setSelectedAppointment(appointment);
    }
  }

  function handleEdit(id: number) {
    const appointment = appointments.find(
      (appointment) => appointment.id === id,
    );

    if (appointment) {
      setEditingAppointment(appointment);

      setEditForm({
        appointment_date: appointment.appointment_date.split("T")[0],

        start_time: appointment.start_time,

        end_time: appointment.end_time,

        status: appointment.status,
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

  async function handleUpdateAppointment(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingAppointment) {
      return;
    }

    try {
      await updateAppointment(editingAppointment.id, editForm);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === editingAppointment.id
            ? {
                ...appointment,
                appointment_date: editForm.appointment_date,

                start_time: editForm.start_time,

                end_time: editForm.end_time,

                status: editForm.status,
              }
            : appointment,
        ),
      );

      setEditingAppointment(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while updating appointment");
      }
    }
  }

  const columns = [
    {
      header: "ID",
      render: (appointment: Appointment) => appointment.id,
    },

    {
      header: "Doctor ID",
      render: (appointment: Appointment) => appointment.doctor_id,
    },

    {
      header: "Patient ID",
      render: (appointment: Appointment) => appointment.patient_id,
    },

    {
      header: "Date",
      render: (appointment: Appointment) => appointment.appointment_date,
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
          <button onClick={() => handleView(appointment.id)}>View</button>

          <button onClick={() => handleEdit(appointment.id)}>Edit</button>
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
      <h2>Appointments</h2>

      <AdminTable columns={columns} data={appointments} />

      {selectedAppointment && (
        <DetailCard
          title="Selected Appointment Details"
          details={[
            {
              label: "ID",
              value: selectedAppointment.id,
            },
            {
              label: "Doctor ID",
              value: selectedAppointment.doctor_id,
            },
            {
              label: "Patient ID",
              value: selectedAppointment.patient_id,
            },
            {
              label: "Status",
              value: selectedAppointment.status,
            },
          ]}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {editingAppointment && (
        <EditForm
          title="Edit Appointment"
          fields={[
            {
              name: "appointment_date",
              label: "Appointment Date",
              type: "date",
              value: editForm.appointment_date,
            },
            {
              name: "start_time",
              label: "Start Time",
              type: "time",
              value: editForm.start_time,
            },
            {
              name: "end_time",
              label: "End Time",
              type: "time",
              value: editForm.end_time,
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              value: editForm.status,
              options: [
                {
                  label: "Scheduled",
                  value: "scheduled",
                },
                {
                  label: "Completed",
                  value: "completed",
                },
                {
                  label: "Cancelled",
                  value: "cancelled",
                },
              ],
            },
          ]}
          onChange={handleEditChange}
          onSubmit={handleUpdateAppointment}
          onCancel={() => setEditingAppointment(null)}
        />
      )}
    </section>
  );
}

export default AdminAppointments;
