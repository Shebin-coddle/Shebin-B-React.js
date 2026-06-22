import { useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { getAllBills } from "../../services/BillService";
import type { Bill } from "../../types/BillTypes";
import DateSearch from "../../components/DateSearch";


function PatientBills() {
  const patientId = Number(localStorage.getItem("user_id"));
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedDate,setSelectedDate]=useState("");

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

  const filteredBills=bills.filter((bill)=>{

    const billDate=new Date(bill.date,).toLocaleDateString("en-CA");
    const matchingDate=!selectedDate || billDate===selectedDate;


    return matchingDate;

  });

  const columns = [
    {
      header: "Amount",
      render: (bill: Bill) => bill.amount,
    },
    {
      header: "Date",
      render: (bill: Bill) =>new Date(bill.date).toLocaleDateString("en-IN"),
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
          {bill.status === "pending" && <button>Pay</button>}
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
      
      <h2>My Bills</h2>
     <DateSearch
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onClear={() => setSelectedDate("")}
      />

      <DataTable columns={columns} data={filteredBills} />
    </section>
  );
}

export default PatientBills;
