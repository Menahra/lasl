import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";

describe("FormInputField", () => {
  it("renders label and input when not loading", () => {
    render(
      <FormInputField
        id="email"
        label="Email address"
        placeholder="Enter email"
        type="email"
        loading={false}
      />,
    );

    const input = screen.getByLabelText("Email address");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "Enter email");
  });

  it("associates label with input via htmlFor/id", () => {
    render(
      <FormInputField
        id="username"
        label="Username"
        loading={false}
        type="text"
        placeholder=""
      />,
    );

    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("id", "username");
  });

  it("allows typing into the input", async () => {
    const user = userEvent.setup();

    render(
      <FormInputField
        id="name"
        label="Name"
        loading={false}
        type="text"
        placeholder=""
      />,
    );

    const input = screen.getByLabelText("Name");

    await user.type(input, "John Doe");

    expect(input).toHaveValue("John Doe");
  });

  it("does not render label and input when loading is true", () => {
    render(
      <FormInputField
        id="password"
        label="Password"
        loading={true}
        type="text"
        placeholder=""
      />,
    );

    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  });
});
