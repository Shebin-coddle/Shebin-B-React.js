import type { ChangeEvent, SyntheticEvent } from "react";

type EditField = {
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

      {fields.map((field) => {
        if (field.type === "textarea") {
          return (
            <textarea
              key={field.name}
              name={field.name}
              value={field.value}
              onChange={onChange}
              placeholder={field.label}
            />
          );
        }

        if (field.type === "select") {
          return (
            <select
              key={field.name}
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
          );
        }

        return (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            value={field.value}
            onChange={onChange}
            placeholder={field.label}
          />
        );
      })}

      <button type="submit">Update</button>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default EditForm;
