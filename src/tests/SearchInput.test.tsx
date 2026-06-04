import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SearchInput from "../components/SearchInput";

test("calls onChange when user types", () => {
  const handleChange = vi.fn();

  render(
    <SearchInput
      value=""
      placeholder="Search users"
      onChange={handleChange}
    />,
  );

  fireEvent.change(screen.getByPlaceholderText("Search users"), {
    target: { value: "admin" },
  });

  expect(handleChange).toHaveBeenCalledWith("admin");
});