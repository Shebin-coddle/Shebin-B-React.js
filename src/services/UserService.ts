import type { UpdateUserRequest, User,CompleteUserForm } from "../types/UserTypes";


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




export async function createCompleteUser(data: CompleteUserForm) {
  const token = localStorage.getItem("token");

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

  const response = await fetch(
    `${API_BASE_URL}/users/create-complete-user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function getUserById(id: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}


export async function getCompleteUser(
  id: number,
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/users/complete-details/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch user details",
    );
  }

  return response.json();
}


export async function updateCompleteUser(
  id: number,
  data: CompleteUserForm,
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/users/edit-complete-user/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}