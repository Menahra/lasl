import { Label } from "@radix-ui/react-label";
import "./styles.css";

type FormInputFieldProps = {
  /** This id is used as id for the input and as htmlFor for the label */
  id: string;
  /** The text on the label */
  label: string;
} & Pick<HTMLInputElement, "placeholder" | "type">;

export const FormInputField = ({
  id,
  label,
  ...props
}: FormInputFieldProps) => {
  return (
    <div className="FormInputField">
      <Label htmlFor={id} className="FormInputFieldLabel">
        {label}
      </Label>
      <input id={id} className="FormInputFieldInput" {...props} />
    </div>
  );
};
