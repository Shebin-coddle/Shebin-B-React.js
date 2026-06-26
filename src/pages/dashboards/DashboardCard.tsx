type DashboardCardProps = Readonly<{
  title: string;
  count: number | string;
}>;

function DashboardCard({ title, count }: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>

      <p>{count}</p>
    </div>
  );
}

export default DashboardCard;