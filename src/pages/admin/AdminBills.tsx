import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { getAllBills, removeBill } from "../../services/BillService";
import type { Bill } from "../../types/BillTypes";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/UserService";
import DeleteModal from "../../components/DeleteModal";

function AdminBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [userName, setUserName] = useState<Record<number, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBills() {
      try {
        const billData = await getAllBills();

        setBills(billData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error occurred while fetching bills");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBills();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();

        const map = Object.fromEntries(
          users.map((u) => [u.id, `${u.first_name} ${u.last_name}`]),
        );

        setUserName(map);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    }

    fetchUsers();
  }, []);

  function openDeleteModal(id: number) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setError("");

      await removeBill(deleteId);

      setBills((prev) => prev.filter((bill) => bill.id !== deleteId));

      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      header: "ID",
      render: (bill: Bill) => bill.id,
    },
    {
      header: "Name",
      render: (bill: Bill) => userName[bill.patient_id] || bill.patient_id,
    },

    {
      header: "Fee ID",
      render: (bill: Bill) => bill.fee_id,
    },

    {
      header: "Amount",
      render: (bill: Bill) => bill.amount,
    },

    {
      header: "Status",
      render: (bill: Bill) => bill.status,
    },

    {
      header: "Payment Mode",
      render: (bill: Bill) => bill.mode_of_payment,
    },

    {
      header: "Actions",
      render: (bill: Bill) => (
        <div className="table-actions">
          <button onClick={() => navigate(`/admin-bills/edit/${bill.id}`)}>
            Edit
          </button>
          <button onClick={() => openDeleteModal(bill.id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading bills...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>Bills</h2>
      <button onClick={() => navigate("/admin-bills/add")}>
        Add bill
      </button>

      <DataTable columns={columns} data={bills} />
      <DeleteModal
        open={deleteId !== null}
        title="Delete bill"
        message="Do you want to continue?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default AdminBills;
