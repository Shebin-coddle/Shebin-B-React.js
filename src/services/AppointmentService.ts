import type {
  Appointment,
  UpdateAppointmentRequest,
  CreateAppointmentRequest,
} from "../types/AppointmentTypes";
function getToken() {
  return localStorage.getItem("token");
}
const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllAppointments(): Promise<Appointment[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/appointment/get-allappointments`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch appointments");
  }

  return data.appointments || data.data || data;
}

export async function updateAppointment(
  id: number,
  appointmentData: UpdateAppointmentRequest,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/appointment/edit-appointment/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(appointmentData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update appointment");
  }
}
export async function cancelAppointment(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/appointment/edit-appointment/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "cancelled",
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel appointment");
  }
}

export async function approveAppointment(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/appointment/edit-appointment/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "booked",
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to approve appointment");
  }
}
export async function completeAppointment(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/appointment/edit-appointment/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "completed",
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to complete appointment");
  }
}


export async function createAppointment(
  appointmentData: CreateAppointmentRequest,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/appointment/add-appointment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(appointmentData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create appointment");
  }
}

export async function getAppointmentById(id: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/appointment/get-appointment/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch appointment");
  }

  return data.appointment || data.data || data;
}

export const removeAppointment = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/Appointment/remove-appointment/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete appointment");
  }

  return data;
};