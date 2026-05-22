import { useEffect, useState } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import {
  getAdminDashboardSummary,
  type AdminDashboardSummary,
} from "../../services/DashboardService";

function AdminDashboard() {
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchDashboardSummary() {
      try {
        const data = await getAdminDashboardSummary();
        setSummary(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching dashboard summary");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardSummary();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!summary) {
    return <p>No dashboard data found</p>;
  }

  return (
    <section>
      <h2>Overview</h2>

      <div className="dashboard-card-grid">
        <DashboardCard title="Total Users" count={summary.totalUsers} />
        <DashboardCard title="Total Doctors" count={summary.totalDoctors} />
        <DashboardCard title="Total Patients" count={summary.totalPatients} />
        <DashboardCard title="Total Nurses" count={summary.totalNurses} />
        <DashboardCard
          title="Total Appointments"
          count={summary.totalAppointments}
        />
        <DashboardCard title="Total Bills" count={summary.totalBills} />
        <DashboardCard
          title="Total Departments"
          count={summary.totalDepartments}
        />
        <DashboardCard title="Total Medicines" count={summary.totalMedicines} />
      </div>
    </section>
  );
}

export default AdminDashboard;