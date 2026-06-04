type DetailItem = {
  label: string;
  value: string | number | null | undefined;
};

type DetailCardProps = {
  title: string;
  details: DetailItem[];
  onClose: () => void;
};

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