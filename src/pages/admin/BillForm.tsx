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
import type {
  UpdateBillRequest,
  CreateBillRequest,
} from "../../types/BillTypes";
import { showSuccess, showError } from "../../utils/toast";
import { getAllUsers } from "../../services/UserService";
import type { User } from "../../types/UserTypes";
import { getAllFees } from "../../services/FeeService";
import type { Fee } from "../../types/FeeTypes";

type BillForm = {
  patient_id: number | "";
  fee_id: number | "";
  amount: number | "";
  date: string;
  description: string;
  status: string;
  mode_of_payment: string;
};

const emptyForm: BillForm = {
  patient_id: "",
  fee_id: "",
  amount: "",
  date: "",
  description: "",
  status: "",
  mode_of_payment: "",
};

function BillForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BillForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.patient_id) {
      newErrors.patient_id = "Patient is required";
    }

    if (!formData.fee_id) {
      newErrors.fee_id = "Fee type is required";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.mode_of_payment) {
      newErrors.mode_of_payment = "Payment mode is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  useEffect(() => {
    async function loadUsers() {
      const res = await getAllUsers();
      setUsers(res);
    }
    loadUsers();
  }, []);

  useEffect(() => {
    async function loadFees() {
      const data = await getAllFees();
      setFees(data);
    }
    loadFees();
  }, []);

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
          patient_id: bill.patient_id ?? "",
          fee_id: bill.fee_id ?? "",
          amount: bill.amount ?? "",
          date: bill.date.split("T")[0],
          description: bill.description ?? "",
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

  const patients = users.filter((u) => u.role_id === 3);

  function handleChange(
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
) {
  const { name, value } = e.target;

  if (name === "fee_id") {
    const selectedFee = fees.find((f) => f.id === Number(value));

    setFormData((prev) => ({
      ...prev,
      fee_id: value === "" ? "" : Number(value),
      amount: selectedFee ? selectedFee.amount : "",
    }));

    return;
  }

  let parsedValue: string | number = value;

  if (name === "amount" || name === "patient_id") {
    parsedValue = value === "" ? "" : Number(value);
  }

  setFormData((prev) => ({
    ...prev,
    [name]: parsedValue,
  }));
}

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return;
    try {
      if (isEdit) {
        await updateBill(Number(id), formData as UpdateBillRequest);
        showSuccess("Bill updated");
      } else {
        await createBill(formData as CreateBillRequest);
        showSuccess("Bill created");
      }

      navigate("/admin-bills");
    } catch (err) {
      showError("Operation failed");
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
            name: "patient_id",
            label: "Patient",
            type: "select",
            value: formData.patient_id,
            options: [
              { label: "Select Patient", value: "" },
              ...patients.map((u) => ({
                label: `${u.first_name} ${u.last_name}`,
                value: u.id,
              })),
            ],
          },
          {
            name: "fee_id",
            label: "Fee Type",
            type: "select",
            value: formData.fee_id,
            options: [
              { label: "Select Fee Type", value: "" },
              ...fees.map((fee: Fee) => ({
                label: `${fee.fee_name} - ₹${fee.amount}`,
                value: fee.id,
              })),
            ],
          },

          {
            name: "amount",
            label: "Amount",
            type: "number",
            value: formData.amount,
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
              { label: "Select status", value: "" , disabled: true},
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
              { label: "Select mode", value: "", disabled: true},
              { label: "Cash", value: "cash" },
              { label: "UPI", value: "upi" },
              { label: "Card", value: "card" },
              { label: "Net Banking", value: "netbanking" },
            ],
          },
        ]}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin-bills")}
      />
    </section>
  );
}

export default BillForm;
