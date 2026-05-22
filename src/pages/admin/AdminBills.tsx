import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

import AdminTable from "../../components/table/AdminTable";

import { getAllBills, updateBill } from "../../services/BillService";

import type { Bill, UpdateBillRequest } from "../../types/BillTypes";
import DetailCard from "../../components/DetailsView";
import EditForm from "../../components/EditForm";

function AdminBills() {
  const [bills, setBills] = useState<Bill[]>([]);

  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const [editForm, setEditForm] = useState<UpdateBillRequest>({
    amount: 0,
    date: "",
    description: "",
    status: "",
    mode_of_payment: "",
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

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

  function handleView(id: number) {
    const bill = bills.find((bill) => bill.id === id);

    if (bill) {
      setSelectedBill(bill);
    }
  }

  function handleEdit(id: number) {
    const bill = bills.find((bill) => bill.id === id);

    if (bill) {
      setEditingBill(bill);

      setEditForm({
        amount: bill.amount,

        date: bill.date.split("T")[0],

        description: bill.description,

        status: bill.status,

        mode_of_payment: bill.mode_of_payment,
      });
    }
  }

  function handleEditChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setEditForm((prevForm) => ({
      ...prevForm,

      [name]: name === "amount" ? Number(value) : value,
    }));
  }

  async function handleUpdateBill(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingBill) {
      return;
    }

    try {
      await updateBill(editingBill.id, editForm);

      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.id === editingBill.id
            ? {
                ...bill,
                amount: editForm.amount,
                date: editForm.date,
                description: editForm.description,
                status: editForm.status,
                mode_of_payment: editForm.mode_of_payment,
              }
            : bill,
        ),
      );

      setEditingBill(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred while updating bill");
      }
    }
  }

  const columns = [
    {
      header: "ID",
      render: (bill: Bill) => bill.id,
    },

    {
      header: "Patient ID",
      render: (bill: Bill) => bill.patient_id,
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
          <button onClick={() => handleView(bill.id)}>View</button>

          <button onClick={() => handleEdit(bill.id)}>Edit</button>
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

      <AdminTable columns={columns} data={bills} />

      {selectedBill && (
        <DetailCard
          title="Selected Bill Details"
          details={[
            {
              label: "ID",
              value: selectedBill.id,
            },
            {
              label: "Patient ID",
              value: selectedBill.patient_id,
            },
            {
              label: "Amount",
              value: selectedBill.amount,
            },
            {
              label: "Status",
              value: selectedBill.status,
            },
            {
              label: "Payment Mode",
              value: selectedBill.mode_of_payment,
            },
          ]}
          onClose={() => setSelectedBill(null)}
        />
      )}
      {editingBill && (
        <EditForm
          title="Edit Bill"
          fields={[
            {
              name: "amount",
              label: "Amount",
              type: "number",
              value: editForm.amount,
            },
            {
              name: "date",
              label: "Date",
              type: "date",
              value: editForm.date,
            },
            {
              name: "description",
              label: "Description",
              type: "text",
              value: editForm.description,
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              value: editForm.status,
              options: [
                {
                  label: "Pending",
                  value: "pending",
                },
                {
                  label: "Completed",
                  value: "completed",
                },
                {
                  label: "Cancelled",
                  value: "cancelled",
                },
              ],
            },
            {
              name: "mode_of_payment",
              label: "Mode of Payment",
              type: "select",
              value: editForm.mode_of_payment,
              options: [
                {
                  label: "Cash",
                  value: "cash",
                },
                {
                  label: "UPI",
                  value: "upi",
                },
                {
                  label: "Card",
                  value: "card",
                },
                {
                  label: "Net Banking",
                  value: "netbanking",
                },
              ],
            },
          ]}
          onChange={handleEditChange}
          onSubmit={handleUpdateBill}
          onCancel={() => setEditingBill(null)}
        />
      )}
    </section>
  );
}

export default AdminBills;
