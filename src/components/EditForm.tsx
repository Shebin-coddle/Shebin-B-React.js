import type { ChangeEvent, SyntheticEvent } from "react";
import "../styles/editForm.css"

export type EditField = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "time" | "textarea" | "select";
  value: string | number;
  options?: {
    label: string;
    value: string | number;
  }[];
};

type EditFormProps = {
  title: string;
  fields: EditField[];
  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

function EditForm({
  title,
  fields,
  onChange,
  onSubmit,
  onCancel,
}: EditFormProps) {
  return (
    <form className="edit-user-form" onSubmit={onSubmit}>
      <h3>{title}</h3>

      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>{field.label} : </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              value={field.value}
              onChange={onChange}
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              value={field.value}
              onChange={onChange}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={field.value}
              onChange={onChange}
            />
          )}
        </div>
      ))}

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