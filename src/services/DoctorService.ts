import type { Doctor, UpdateDoctorRequest,DoctorDetails } from "../types/DoctorTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllDoctors(): Promise<Doctor[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/doctor/get-alldoctors`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch doctors");
  }

  return data.data;
}



export async function updateDoctor(
  userId: number,
  doctorData: UpdateDoctorRequest
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/doctor/edit-doctor/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(doctorData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update doctor");
  }
}

export async function getDoctorsWithDetails(): Promise<DoctorDetails[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/doctor/get-doctors-with-details`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch doctors");
  }

  return data.data;
}

export async function createDoctor(
  doctorData: {
    user_id: number;
    specialization: string;
    salary: number;
    department_id: number;
  },
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/doctor/add-doctor`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(doctorData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create doctor",
    );
  }
}

export const removeDoctor = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/Doctor/remove-doctor/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete doctor");
  }

  return data;
};