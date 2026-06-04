import type { UpdateUserRequest, User,CreateUserRequest } from "../types/UserTypes";


const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllUsers(): Promise<User[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/users/get-allusers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data.users || data.data || data;
}

export const removeUser = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/users/remove-user/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete user");
  }

  return data;
};


export async function updateUser(
  id: number,
  userData: UpdateUserRequest
): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/users/edit-user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update user");
  }

  return data.user || data.data || data;
}



export async function createUser(
  userData: CreateUserRequest
): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/users/add-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create user");
  }

  return data.user || data.data || data;
}