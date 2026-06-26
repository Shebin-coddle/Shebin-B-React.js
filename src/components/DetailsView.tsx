type DetailItem = Readonly<{
  label: string;
  value: string | number | null | undefined;
}>;

type DetailCardProps = Readonly<{
  title: string;
  details: readonly DetailItem[];
  onClose: () => void;
}>;

function DetailCard({ title, details, onClose }: DetailCardProps) {
  return (
    <div className="user-detail-card">
      <h3>{title}</h3>

      {details.map((item) => (
        <p key={item.label}>
          <strong>{item.label}:</strong> {item.value || "N/A"}
        </p>
      ))}

      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default DetailCard;