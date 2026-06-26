import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditForm from "../../components/EditForm";
import type { EditField } from "../../components/EditForm";

import {
  createFee,
  updateFee,
  getFeeById,
} from "../../services/FeeService";

import { showSuccess, showError } from "../../utils/toast";

function FeeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fee_name: "",
    amount: 0,
  });

  useEffect(() => {
    if (!isEdit || !id) return;

    async function loadFee() {
      try {
        const fee = await getFeeById(Number(id));

        setFormData({
          fee_name: fee.fee_name ?? "",
          amount: fee.amount ?? 0,
        });
      } catch (error) {
        console.error(error);
        showError("Failed to load fee");
      }
    }

    loadFee();
  }, [id, isEdit]);

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  }

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!formData.fee_name.trim()) {
      newErrors.fee_name = "Fee name is required";
    }

    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit && id) {
        await updateFee(Number(id), formData);
        showSuccess("Fee updated successfully");
      } else {
        await createFee(formData);
        showSuccess("Fee created successfully");
      }

      navigate("/admin-fees");
    } catch (error) {
      console.error(error);
      showError("Operation unsuccessful");
    }
  }

  const fields: EditField[] = [
    {
      name: "fee-section",
      label: "Fee Information",
      type: "section",
    },
    {
      name: "fee_name",
      label: "Fee Name",
      type: "text",
      value: formData.fee_name,
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      value: formData.amount,
    },
  ];

  return (
    <EditForm
      title={isEdit ? "Edit Fee" : "Add Fee"}
      fields={fields}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin-fees")}
    />
  );
}

export default FeeForm;