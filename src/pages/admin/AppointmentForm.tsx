import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import EditForm from "../../components/EditForm";

import {
  getAppointmentById,
  createAppointment,
  updateAppointment,
} from "../../services/AppointmentService";

import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "../../types/AppointmentTypes";

type AppointmentForm = {
  doctor_id: number | "";
  patient_id: number | "";
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
};

const emptyForm: AppointmentForm = {
  doctor_id: "",
  patient_id: "",
  appointment_date: "",
  start_time: "",
  end_time: "",
  status: "booked",
};

function AppointmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<AppointmentForm>(emptyForm);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let ignore = false;

    async function loadAppointment() {
      if (!isEdit || !id) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAppointmentById(Number(id));

        const appt: Appointment = Array.isArray(response)
          ? response[0]
          : response;

        if (ignore) return;

        setFormData({
          doctor_id: appt.doctor_id,
          patient_id: appt.patient_id,
          appointment_date: appt.appointment_date?.split("T")[0] || "",
          start_time: appt.start_time || "",
          end_time: appt.end_time || "",
          status: appt.status || "booked",
        });
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading data");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadAppointment();

    return () => {
      ignore = true;
    };
  }, [id, isEdit]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "doctor_id" || name === "patient_id"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (isEdit && id) {
        const updatePayload: UpdateAppointmentRequest = {
          appointment_date: formData.appointment_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          status: formData.status,
        };

        await updateAppointment(Number(id), updatePayload);
      } else {
        const createPayload: CreateAppointmentRequest = {
          doctor_id: Number(formData.doctor_id),
          patient_id: Number(formData.patient_id),
          appointment_date: formData.appointment_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          status: formData.status,
        };

        await createAppointment(createPayload);
      }

      navigate("/admin-appointments");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error saving data");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <EditForm
      title={isEdit ? "Edit Appointment" : "Add Appointment"}
      fields={[
        {
          name: "doctor_id",
          label: "Doctor ID",
          type: "number",
          value: formData.doctor_id,
        },
        {
          name: "patient_id",
          label: "Patient ID",
          type: "number",
          value: formData.patient_id,
        },
        {
          name: "appointment_date",
          label: "Date",
          type: "date",
          value: formData.appointment_date,
        },
        {
          name: "start_time",
          label: "Start Time",
          type: "time",
          value: formData.start_time,
        },
        {
          name: "end_time",
          label: "End Time",
          type: "time",
          value: formData.end_time,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          value: formData.status,
          options: [
            { label: "Booked", value: "booked" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ],
        },
      ]}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin-appointments")}
    />
  );
}

export default AppointmentForm;
