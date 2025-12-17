import { Label } from "@radix-ui/react-label";
import {
  Skeleton,
  type SkeletonProps,
} from "@/src/shared/components/skeleton/Skeleton.tsx";
import "./styles.css";

type FormInputFieldProps = {
  /** This id is used as id for the input and as htmlFor for the label */
  id: string;
  /** The text on the label */
  label: string;
} & Pick<HTMLInputElement, "placeholder" | "type"> &
  Pick<SkeletonProps, "loading">;

export const FormInputField = ({
  id,
  label,
  loading,
  ...props
}: FormInputFieldProps) => {
  return (
    <div className="FormInputField">
      <Skeleton loading={loading} width={60} height={16}>
        <Label htmlFor={id} className="FormInputFieldLabel">
          {label}
        </Label>
      </Skeleton>
      <Skeleton loading={loading} width="100%" height={25}>
        <input id={id} className="FormInputFieldInput" {...props} />
      </Skeleton>
    </div>
  );
};
