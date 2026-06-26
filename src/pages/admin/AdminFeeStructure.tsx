import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "../../components/table/DataTable";
import DeleteModal from "../../components/DeleteModal";

import {
  getAllFees,
  removeFee,
} from "../../services/FeeService";

import type { Fee } from "../../types/FeeTypes";

function AdminFees() {
  const navigate = useNavigate();

  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchFees() {
      try {
        const data = await getAllFees();
        setFees(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch fee structures",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFees();
  }, []);

  function openDeleteModal(id: number) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await removeFee(deleteId);

      setFees((prev) =>
        prev.filter((fee) => fee.id !== deleteId),
      );

      setDeleteId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Delete failed",
      );
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      header: "ID",
      render: (fee: Fee) => fee.id,
    },
    {
      header: "Fee Name",
      render: (fee: Fee) => fee.fee_name,
    },
    {
      header: "Amount",
      render: (fee: Fee) => `₹${fee.amount}`,
    },
    {
      header: "Actions",
      render: (fee: Fee) => (
        <div className="table-actions">
          <button
            onClick={() =>
              navigate(`/admin-fees/edit/${fee.id}`)
            }
          >
            Edit
          </button>

          <button
            onClick={() => openDeleteModal(fee.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading fee structures...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <div className="user-header">
        <h2>Fee Structures</h2>

        <button
          className="add-btn"
          onClick={() => navigate("/admin-fees/add")}
        >
          Add Fees
        </button>
      </div>

      <DataTable
        columns={columns}
        data={fees}
      />

      <DeleteModal
        open={deleteId !== null}
        title="Delete Fee Structure"
        message="Do you want to continue?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default AdminFees;