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
import { getAllUsers } from "../../services/UserService";
import { showSuccess, showError } from "../../utils/toast";

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
  status: "",
};

function AppointmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<AppointmentForm>(emptyForm);

  const [doctorMap, setDoctorMap] = useState<Record<number, string>>({});
  const [patientMap, setPatientMap] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const users = await getAllUsers();
        const doctors = users.filter((u) => u.role_id === 2);

        const map = Object.fromEntries(
          doctors.map((d) => [d.id, `Dr. ${d.first_name} ${d.last_name}`]),
        );

        setDoctorMap(map);
      } catch (err) {
        console.error("Failed to load doctors", err);
      }
    }

    fetchDoctors();
  }, []);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.doctor_id) {
      newErrors.doctor_id = "Doctor is required";
    }

    if (!formData.patient_id) {
      newErrors.patient_id = "Patient is required";
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = "Date is required";
    }

    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
    }

    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        newErrors.end_time = "End time must be after start time";
      }
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  useEffect(() => {
    async function fetchPatients() {
      try {
        const users = await getAllUsers();
        const patients = users.filter((u) => u.role_id === 3);

        const map = Object.fromEntries(
          patients.map((p) => [p.id, `${p.first_name} ${p.last_name}`]),
        );

        setPatientMap(map);
      } catch (err) {
        console.error("Failed to load patients", err);
      }
    }

    fetchPatients();
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadAppointment() {
      if (!isEdit || !id) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAppointmentById(Number(id));

        const appointment: Appointment = Array.isArray(response)
          ? response[0]
          : response;

        if (ignore) return;

        setFormData({
          doctor_id: appointment.doctor_id,
          patient_id: appointment.patient_id,
          appointment_date: appointment.appointment_date?.split("T")[0] || "",
          start_time: appointment.start_time || "",
          end_time: appointment.end_time || "",
          status: appointment.status || "booked",
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

  let parsedValue: string | number = value;

  if (name === "doctor_id" || name === "patient_id") {
    parsedValue = value === "" ? "" : Number(value);
  }

  setFormData((prev) => ({
    ...prev,
    [name]: parsedValue,
  }));
}

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEdit && id) {
        const updatePayload: UpdateAppointmentRequest = {
          appointment_date: formData.appointment_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          status: formData.status,
        };

        await updateAppointment(Number(id), updatePayload);
        showSuccess("Details Updated");
      } else {
        const createPayload: CreateAppointmentRequest = {
          doctor_id: Number(formData.doctor_id),
          patient_id: Number(formData.patient_id),
          appointment_date: formData.appointment_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          status: formData.status,
        };

        console.log(createPayload)

        await createAppointment(createPayload);
        
        showSuccess("Appointment created successfully");
      }

      navigate("/admin-appointments");
    } catch (error) {
      showError("Appointment not created");
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
          label: "Doctor",
          type: "select",
          value: formData.doctor_id,
          options: [
            { label: "Select Doctor", value: 0 },
            ...Object.entries(doctorMap).map(([id, name]) => ({
              value: Number(id),
              label: name,
            })),
          ],
        },
        {
          name: "patient_id",
          label: "Patient",
          type: "select",
          value: formData.patient_id,
          options: [
            { label: "Select Patient", value: 0 },
            ...Object.entries(patientMap).map(([id, name]) => ({
              value: Number(id),
              label: name,
            })),
          ],
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
            { label: "Select status", value: "", disabled:true},
            { label: "Booked", value: "booked" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ],
        },
      ]}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin-appointments")}
    />
  );
}

export default AppointmentForm;
