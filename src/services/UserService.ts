import type { UpdateUserRequest, User } from "../types/UserTypes";


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

export async function deleteUser(id:number): Promise<void>{
  const token=localStorage.getItem("token");

   const response = await fetch(`${API_BASE_URL}/users/remove-user/${id}`,{
    method:"DELETE",
    headers:{
      Authorization:`Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete user");
  }

}


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