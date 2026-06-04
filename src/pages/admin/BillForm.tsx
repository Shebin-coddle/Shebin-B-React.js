import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditForm from "../../components/EditForm";
import {
  createBill,
  updateBill,
  getBillById,
} from "../../services/BillService";
import type { UpdateBillRequest } from "../../types/BillTypes";

type BillForm = {
  amount: number | "";
  date: string;
  description: string;
  status: string;
  mode_of_payment: string;
};

const emptyForm: BillForm = {
  amount: "",
  date: "",
  description: "",
  status: "pending",
  mode_of_payment: "cash",
};

function BillForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BillForm>(emptyForm);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    async function loadBill() {
      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        const response = await getBillById(Number(id));
        const bill = Array.isArray(response) ? response[0] : response;

        if (ignore) return;
        setFormData({
          amount: bill.amount,
          date: bill.date.split("T")[0],
          description: bill.description,
          status: bill.status,
          mode_of_payment: bill.mode_of_payment,
        });
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading bill");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadBill();

    return () => {
      ignore = true;
    };
  }, [id, isEdit]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateBill(Number(id), formData as UpdateBillRequest);
      } else {
        await createBill(formData as UpdateBillRequest);
      }
      navigate("/admin-bills");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving bill");
    }
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  return (
    <section>
      <h2>{isEdit ? "Edit Bill" : "Add Bill"}</h2>

      <EditForm
        title={isEdit ? "Edit Bill" : "Add Bill"}
        fields={[
          {
            name: "amount",
            label: "Amount",
            type: "number",
            value: formData.amount === "" ? "" : formData.amount,
          },
          {
            name: "date",
            label: "Date",
            type: "date",
            value: formData.date,
          },
          {
            name: "description",
            label: "Description",
            type: "text",
            value: formData.description,
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            value: formData.status,
            options: [
              { label: "Pending", value: "pending" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
          {
            name: "mode_of_payment",
            label: "Mode of Payment",
            type: "select",
            value: formData.mode_of_payment,
            options: [
              { label: "Cash", value: "cash" },
              { label: "UPI", value: "upi" },
              { label: "Card", value: "card" },
              { label: "Net Banking", value: "netbanking" },
            ],
          },
        ]}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin-bills")}
      />
    </section>
  );
}

export default BillForm;
