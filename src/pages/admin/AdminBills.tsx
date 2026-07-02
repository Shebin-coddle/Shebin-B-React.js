import { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { getAllBills, removeBill } from "../../services/BillService";
import { getAllFees } from "../../services/FeeService";
import type { Bill } from "../../types/BillTypes";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/UserService";
import DeleteModal from "../../components/DeleteModal";
import type { Fee } from "../../types/FeeTypes";

function AdminBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [userName, setUserName] = useState<Record<number, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [feeMap, setFeeMap] = useState<Record<number, string>>({});

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
    async function fetchFees() {
      try {
        const fees = await getAllFees();

        const map = Object.fromEntries(
          fees.map((f: Fee) => [f.id, f.fee_name]),
        );

        setFeeMap(map);
      } catch (err) {
        console.error("Failed to load fees", err);
      }
    }

    fetchFees();
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

  const openDeleteModal = useCallback((id: number) => {
    setDeleteId(id);
  }, []);

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

  const filteredBills = bills.filter((bill) => {
    const patientName = (userName[bill.patient_id] || "").toLowerCase();

    const matchesName = patientName.includes(searchText.toLowerCase());

    const billDate = new Date(bill.date).toLocaleDateString("en-CA");

    const matchesDate = !selectedDate || billDate === selectedDate;

    return matchesName && matchesDate;
  });
  const getReceiptUrl = (link?: string | null) => {
    if (!link) return "";
    if (link.startsWith("http")) return link;
    return `${import.meta.env.VITE_API_URL}${link}`;
  };

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
      header: "Fee Type",
      render: (bill: Bill) => feeMap[bill.fee_id] || bill.fee_id,
    },

    {
      header: "Date",
      render: (bill: Bill) => new Date(bill.date).toLocaleDateString("en-IN"),
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
          <button onClick={() => openDeleteModal(bill.id)}>Delete</button>
        </div>
      ),
    },
    {
      header: "Receipt",
      render: (bill: Bill) =>
        bill.receipt_link ? (
          <button
            className="report-btn"
            onClick={() =>
              window.open(getReceiptUrl(bill.receipt_link), "_blank")
            }
          >
            View Receipt
          </button>
        ) : (
          "-"
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
      <div className="pages-header">
        <h2>Bills</h2>
        <div className="pages-actions">
          <button
            className="add-btn"
            onClick={() => navigate("/admin-bills/add")}
          >
            Add Bill
          </button>
        </div>
      </div>
      <div className="appointment-filters">
        <div>
          <input
            type="text"
            placeholder="Search by patient name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setSearchText("");
            setSelectedDate("");
          }}
        >
          Clear Filters
        </button>
      </div>

      <DataTable columns={columns} data={filteredBills} />
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
