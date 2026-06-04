import type { ReactNode } from "react";

type DeleteModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
  children?: ReactNode;
};

function DeleteModal({
  open,
  onConfirm,
  onCancel,
  loading = false,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  children,
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>

        {children}

        <div className="modal-actions">
          <button onClick={onCancel} disabled={loading}>
            Cancel
          </button>

          <button onClick={onConfirm} disabled={loading} className="delete">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;