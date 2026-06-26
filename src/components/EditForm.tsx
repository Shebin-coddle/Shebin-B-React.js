import type { ChangeEvent, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";

export type EditField = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "time" | "textarea" | "select" | "section";
  value?: string | number;
  options?: {
    label: string;
    value: string | number;
    disabled?: boolean;
  }[];
};

type EditFormProps = Readonly<{
  title: string;
  fields: EditField[];
  errors?: Record<string, string>;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  mode?: "create" | "edit";
}>;

function EditForm({
  title,
  fields,
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  mode = "create",
}: EditFormProps) {
  const navigate = useNavigate();

  function renderField(field: EditField) {
    if (field.type === "textarea") {
      return (
        <textarea
          id={field.name}
          name={field.name}
          value={field.value}
          onChange={onChange}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          id={field.name}
          name={field.name}
          value={field.value}
          onChange={onChange}
        >
          {field.options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        value={field.value}
        onChange={onChange}
      />
    );
  }

  return (
    <form className="edit-user-form" onSubmit={onSubmit}>
      <h2>{title}</h2>

      {fields.map((field) => {
        if (field.type === "section") {
          return (
            <h3 key={field.name} className="form-section-title">
              {field.label}
            </h3>
          );
        }

        return (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label} :</label>

            {renderField(field)}

            {field.name === "patient_id" && mode === "edit" && (
              <button
                type="button"
                onClick={() => navigate("/admin-users/add")}
                style={{ padding: "6px 10px", cursor: "pointer" }}
              >
                Add new patient
              </button>
            )}

            {errors[field.name] && (
              <p className="field-error">{errors[field.name]}</p>
            )}
          </div>
        );
      })}

      <div className="form-actions">
        <button type="submit">Save</button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditForm;