import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorsWithDetails } from "../services/DoctorService";
import { getAllDepartments } from "../services/DepartmentService";
import type { DoctorDetails } from "../types/DoctorTypes";
import type { Department } from "../types/DepartmentTypes";
import type { User } from "../types/UserTypes";
import { getAllUsers } from "../services/UserService";

import "../styles/doctorList.css";

function DoctorBookingPage() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [doctorData, departmentData, userData] = await Promise.all([
          getDoctorsWithDetails(),
          getAllDepartments(),
          getAllUsers(),
        ]);

        setDoctors(doctorData);
        setDepartments(departmentData);
        setUsers(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.first_name} ${doctor.last_name}`.toLowerCase();

    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesDepartment =
      selectedDepartmentId === 0 ||
      doctor.department_id === selectedDepartmentId;
    return matchesSearch && matchesDepartment;
  });

  const departmentMap: Record<number, string> = Object.fromEntries(
    departments.map((d) => [d.id, d.department_name]),
  );
  const userMap: Record<
    number,
    {
      email: string | null;
      phone: string | null;
      name: string;
    }
  > = Object.fromEntries(
    users.map((u) => [
      u.id,
      {
        email: u.email,
        phone: u.phone,
        name: `${u.first_name} ${u.last_name}`,
      },
    ]),
  ) as Record<
    number,
    {
      email: string | null;
      phone: string | null;
      name: string;
    }
  >;

  function handleBookAppointment(doctorId: number) {
    navigate(`/patient-book-appointment?doctorId=${doctorId}`);
  }

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <section className="doctor-booking-page">
        <div className="page-header">
          <h1>Our Specialists</h1>

          <p>Find experienced doctors and book your appointment online.</p>
        </div>
        <div className="doctor-filters">
          <input
            type="text"
            placeholder="Search doctor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={selectedDepartmentId}
            onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
          >
            <option value={0}>All Departments</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.department_name}
              </option>
            ))}
          </select>
        </div>

        <div className="doctor-grid">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.user_id} className="doctor-card">
              <h3>
                Dr. {doctor.first_name.toUpperCase()}{" "}
                {doctor.last_name.toUpperCase()}
              </h3>

              <p className="specialization">{doctor.specialization}</p>

              <p>
                <strong>Department:</strong>
                {departmentMap[doctor.department_id]}
              </p>

              <p>
                <strong>Email:</strong>
                {userMap[doctor.user_id]?.email}
              </p>

              <p>
                <strong>Phone:</strong>
                {userMap[doctor.user_id]?.phone}
              </p>

              <button onClick={() => handleBookAppointment(doctor.user_id)}>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
        {!filteredDoctors.length && (
          <p className="no-data">No doctors found.</p>
        )}
      </section>
    </div>
  );
}

export default DoctorBookingPage;
