import type {
  Department,
  UpdateDepartmentRequest,
} from "../types/DepartmentTypes";
import api from "./api";

export async function getAllDepartments(): Promise<Department[]> {
  const response = await api.get(`/department/get-alldepartmentS`);
  return response.data.departments || response.data.data || response.data;
}

export async function updateDepartment(
  id: number,
  departmentData: UpdateDepartmentRequest,
): Promise<void> {
  await api.put(`/department/edit-department/${id}`, departmentData);
}

export async function getDepartmentById(id: number): Promise<Department> {
  const response = await api.get(`/department/get-department/${id}`);

  return response.data.data?.[0] || response.data.data || response.data;
}

export async function createDepartment(
  departmentData: UpdateDepartmentRequest,
): Promise<void> {
  console.log(departmentData);
  await api.post(`/department/add-department`, departmentData);
}

export const removeDepartment = async (id: number) => {
  const response = await api.delete(`/department/remove-department/${id}`);

  return response.data;
};
