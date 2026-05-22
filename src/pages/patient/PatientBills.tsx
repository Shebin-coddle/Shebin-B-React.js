import { useEffect, useState } from "react";
import AdminTable from "../../components/table/AdminTable";

import { getAllBills } from "../../services/BillService";
import type { Bill } from "../../types/BillTypes";

function PatientBills() {
  const patientId = Number(localStorage.getItem("user_id"));

  const [bills, setBills] = useState<Bill[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchPatientBills() {
      try {
        const billData = await getAllBills();

        const patientBills = billData.filter(
          (bill) => bill.patient_id === patientId,
        );

        setBills(patientBills);
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

    fetchPatientBills();
  }, [patientId]);

  const columns = [
    {
      header: "Amount",
      render: (bill: Bill) => bill.amount,
    },
    {
      header: "Date",
      render: (bill: Bill) => bill.date,
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


         {bill.status === "pending" && (
        <button>
          Pay
        </button>
      )}

    </div>
  ),
}
  ];

  if (loading) {
    return <p>Loading bills...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>My Bills</h2>

      <AdminTable columns={columns} data={bills} />
    </section>
  );
}

export default PatientBills;
