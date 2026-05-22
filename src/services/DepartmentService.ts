import type {
  Department,
  UpdateDepartmentRequest,
} from "../types/DepartmentTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllDepartments(): Promise<Department[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/department/get-alldepartmentS`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch departments");
  }

  return data.departments || data.data || data;
}

export async function updateDepartment(
  id: number,
  departmentData: UpdateDepartmentRequest,
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/department/edit-department/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(departmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update department");
  }
}