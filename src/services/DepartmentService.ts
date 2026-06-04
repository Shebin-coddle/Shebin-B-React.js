import type {
  Department,
  UpdateDepartmentRequest,
} from "../types/DepartmentTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllDepartments(): Promise<Department[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/department/get-alldepartmentS`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

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

  const response = await fetch(
    `${API_BASE_URL}/department/edit-department/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(departmentData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update department");
  }
}

export async function getDepartmentById(
  id: number,
): Promise<Department> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/department/get-department/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch department",
    );
  }

  return data.data?.[0] || data.data || data;
}

export async function createDepartment(
  departmentData: UpdateDepartmentRequest,
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/department/add-department`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(departmentData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create department",
    );
  }
}

export const removeDepartment = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/department/remove-department/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete department");
  }

  return data;
};