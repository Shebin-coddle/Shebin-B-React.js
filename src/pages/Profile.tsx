import { useEffect, useState } from "react";
import { getCompleteUser } from "../services/UserService";
import "../styles/Profile.css";
import { getAllDepartments } from "../services/DepartmentService";
import type { Department } from "../types/DepartmentTypes";

type ProfileData = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: number;

  street_name: string;
  city: string;
  district: string;
  state: string;
  pincode: string;

  specialization?: string;
  doctor_department_id?: number | null;
  doctor_salary?: string | null;

  nurse_department_id?: number | null;
  nurse_salary?: string | null;

  dob?: string;
  blood_group?: string;
};

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [error, setError] = useState("");

  const userId = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getCompleteUser(userId);
        console.log(data);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const departments = await getAllDepartments();

        setDepartments(departments);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDepartments();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!profile) {
    return <p>No profile data found.</p>;
  }

  const departmentName =
    departments.find(
      (dept) =>
        dept.id === profile.nurse_department_id ||
        dept.id === profile.doctor_department_id,
    )?.department_name || "N/A";

  return (
    <section className="profile-page">
      <div className="profile-header">
        <div>
          <h2>
            {profile.first_name.toUpperCase()} {profile.last_name.toUpperCase()}
          </h2>

          <p className="profile-role">
            {profile.role_id === 1
              ? "Admin"
              : profile.role_id === 2
                ? "Doctor"
                : profile.role_id === 3
                  ? "Patient"
                  : "Nurse"}
          </p>
        </div>
      </div>

      <div className="profile-card">
        <h3>Personal Information</h3>

        <div className="profile-grid">
          <div>
            <span className="label">Email</span>
            <span>{profile.email}</span>
          </div>

          <div>
            <span className="label">Phone</span>
            <span>{profile.phone}</span>
          </div>

          <div>
            <span className="label">User ID</span>
            <span>{profile.id}</span>
          </div>
        </div>
      </div>

      {profile.role_id !== 1 &&(
      <div className="profile-card">
        <h3>Address Information</h3>

        <div className="profile-grid">
          <div>
            <span className="label">Street</span>
            <span>{profile.street_name}</span>
          </div>

          <div>
            <span className="label">City</span>
            <span>{profile.city}</span>
          </div>

          <div>
            <span className="label">District</span>
            <span>{profile.district}</span>
          </div>

          <div>
            <span className="label">State</span>
            <span>{profile.state}</span>
          </div>

          <div>
            <span className="label">Pincode</span>
            <span>{profile.pincode}</span>
          </div>
        </div>
      </div>
      )}

      {profile.role_id === 2 && (
        <div className="profile-card">
          <h3>Doctor Information</h3>

          <div className="profile-grid">
            <div>
              <span className="label">Specialization</span>
              <span>{profile.specialization}</span>
            </div>

            <div>
              <span className="label">Department</span>
              <span>{departmentName}</span>
            </div>

            <div>
              <span className="label">Salary</span>
              <span>{profile.doctor_salary}</span>
            </div>
          </div>
        </div>
      )}

      {profile.role_id === 3 && (
        <div className="profile-card">
          <h3>Patient Information</h3>

          <div className="profile-grid">
            <div>
              <span className="label">Date of Birth</span>
              <span>
                {profile.dob
                  ? new Date(profile.dob).toLocaleDateString("en-IN")
                  : "N/A"}
              </span>
            </div>

            <div>
              <span className="label">Blood Group</span>
              <span>{profile.blood_group}</span>
            </div>
          </div>
        </div>
      )}

      {profile.role_id === 4 && (
        <div className="profile-card">
          <h3>Nurse Information</h3>

          <div className="profile-grid">
            <div>
              <span className="label">Department</span>
              <span>{departmentName}</span>
            </div>

            <div>
              <span className="label">Salary</span>
              <span>{profile.nurse_salary}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Profile;
