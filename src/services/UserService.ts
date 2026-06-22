import type {
  UpdateUserRequest,
  User,
  CompleteUserForm,
} from "../types/UserTypes";

import api from "./api";

export async function getAllUsers(): Promise<User[]> {
  const response = await api.get(`/users/get-allusers`);
  return response.data.users || response.data.data || response.data;
}

export const removeUser = async (id: number) => {
  const response = await api.delete(`/users/remove-user/${id}`);

  return response.data;
};

export async function updateUser(
  id: number,
  userData: UpdateUserRequest,
): Promise<User> {

  const response = await api.put(`/users/edit-user/${id}`, userData);

  

  return response.data.user || response.data.data || response.data;
}

export async function createCompleteUser(data: CompleteUserForm) {
  const payload = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    role_id: data.role_id,

    address: {
      street_name: data.street_name,
      city: data.city,
      district: data.district,
      state: data.state,
      pincode: data.pincode,
    },

    doctor:
      data.role_id === 2
        ? {
            specialization: data.specialization,
            salary: data.salary,
            department_id: data.department_id,
          }
        : undefined,

    patient:
      data.role_id === 3
        ? {
            dob: data.dob,
            blood_group: data.blood_group,
          }
        : undefined,

    nurse:
      data.role_id === 4
        ? {
            salary: data.salary,
            department_id: data.department_id,
          }
        : undefined,
  };

  const { data: result } = await api.post(
    "/users/add-complete-user",
    payload,
  );

  return result;
}

export async function getUserById(id: number) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function getCompleteUser(id: number) {
  const { data } = await api.get(`/users/complete-details/${id}`);
  return data;
}

export async function updateCompleteUser(
  id: number,
  data: CompleteUserForm,
) {
  const { data: result } = await api.put(
    `/users/edit-complete-user/${id}`,
    data,
  );

  return result;
}