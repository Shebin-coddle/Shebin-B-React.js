import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { getAllBills, payBill } from "../../services/BillService";
import type { Bill } from "../../types/BillTypes";
import DateSearch from "../../components/DateSearch";
import { showSuccess, showError } from "../../utils/toast";
import { getReceiptUrl } from "../../utils/url";

function PatientBills() {
  const patientId = Number(localStorage.getItem("user_id"));

  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function fetchPatientBills() {
      try {
        const billData = await getAllBills();

        setBills(
          billData.filter((bill) => bill.patient_id === patientId),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error occurred while fetching bills",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPatientBills();
  }, [patientId]);

  const filteredBills = bills.filter((bill) => {
    const billDate = new Date(bill.date).toISOString().split("T")[0];
    return !selectedDate || billDate === selectedDate;
  });

  async function handlePayBill() {
    if (!selectedBillId || !paymentMode) return;

    try {
      setPaying(true);

      const result = await payBill(selectedBillId, paymentMode);

      showSuccess(result.message);

      setBills((prev) =>
        prev.map((bill) =>
          bill.id === selectedBillId
            ? {
                ...bill,
                status: "completed",
                mode_of_payment: paymentMode,
                receipt_link: result.receiptLink,
              }
            : bill,
        ),
      );

      setSelectedBillId(null);
      setPaymentMode("");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Payment failed",
      );
    } finally {
      setPaying(false);
    }
  }

  const columns = [
    {
      header: "Amount",
      render: (bill: Bill) => bill.amount,
    },
    {
      header: "Date",
      render: (bill: Bill) =>
        new Date(bill.date).toLocaleDateString("en-IN"),
    },
    {
      header: "Description",
      render: (bill: Bill) => bill.description,
    },
    {
      header: "Status",
      render: (bill: Bill) => bill.status,
    },
    {
      header: "Payment Mode",
      render: (bill: Bill) => bill.mode_of_payment || "N/A",
    },
    {
      header: "Actions",
      render: (bill: Bill) => (
        <div className="table-actions">
          {bill.status !== "completed" && (
            <button onClick={() => setSelectedBillId(bill.id)}>
              Pay Bill
            </button>
          )}
        </div>
      ),
    },
    {
      header: "Receipt",
      render: (bill: Bill) => (
        <div className="View-reciept">
          {bill.receipt_link ? (
            <button
              onClick={() =>
                window.open(
                  getReceiptUrl(bill.receipt_link),
                  "_blank",
                )
              }
            >
              View Receipt
            </button>
          ) : (
            "-"
          )}
        </div>
      ),
    },
  ];

  if (loading) return <p>Loading bills...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>My Bills</h2>

      <DateSearch
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onClear={() => setSelectedDate("")}
      />

      <DataTable columns={columns} data={filteredBills} />

      {selectedBillId !== null && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <h3>Payment</h3>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="">Select Payment</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Net Banking</option>
            </select>

            <div className="modal-actions">
              <button onClick={handlePayBill} disabled={paying}>
                {paying ? "Processing..." : "Confirm"}
              </button>

              <button
                onClick={() => {
                  setSelectedBillId(null);
                  setPaymentMode("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PatientBills;