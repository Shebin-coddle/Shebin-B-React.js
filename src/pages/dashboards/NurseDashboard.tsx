import { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { getNurseById } from "../../services/NurseService";
import { getAllDepartments } from "../../services/DepartmentService";
import type { Department } from "../../types/DepartmentTypes";

function NurseDashboard() {
  const userId = Number(localStorage.getItem("user_id"));

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchNurseDashboard() {
      try {
        const nurseData = await getNurseById(userId);

        const departmentData = await getAllDepartments();

        const nurseDepartment = departmentData.find(
          (department) => department.id === nurseData.department_id,
        );

        if (nurseDepartment) {
          setDepartment(nurseDepartment);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching nurse dashboard");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNurseDashboard();
  }, [userId]);

  if (loading) {
    return <p>Loading nurse dashboard...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>Overview</h2>
      <div className="dashboard-card-grid">
        <DashboardCard
          title="Department"
          count={department?.department_name || "N/A"}
        />

        <DashboardCard
          title="Department Contact"
          count={department?.contact_number || "N/A"}
        />
      </div>
    </section>
  );
}

export default NurseDashboard;
