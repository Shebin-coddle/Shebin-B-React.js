import type { Nurse, UpdateNurseRequest } from "../types/NurseTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllNurses(): Promise<Nurse[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/nurse/get-allnurses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch nurses");
  }

  return data.nurses || data.data || data;
}

export async function updateNurse(
  userId: number,
  nurseData: UpdateNurseRequest,
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/nurse/edit-nurse/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(nurseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update nurse");
  }
}

export async function getNurseById(
  id: number,
): Promise<Nurse> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/nurse/get-nurse/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch nurse details",
    );
  }

 return data.data[0];
}