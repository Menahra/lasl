import { Label } from "@radix-ui/react-label";
import {
  Skeleton,
  type SkeletonProps,
} from "@/src/shared/components/skeleton/Skeleton.tsx";
import "./FormInputField.css";
import clsx from "clsx";
import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";

type FormInputFieldProps = {
  /** This id is used as id for the input and as htmlFor for the label */
  id: string;
  /** The text on the label */
  label: string;
  /** an optional error string which indicates that this field is erroneous */
  error?: FieldError | undefined;
} & Pick<HTMLInputElement, "placeholder" | "type" | "name"> &
  Pick<SkeletonProps, "loading">;

export const FormInputField = forwardRef<HTMLInputElement, FormInputFieldProps>(
  ({ id, label, loading, error, ...props }, ref) => {
    return (
      <div className="FormInputField">
        <Skeleton loading={loading} width={60} height={16}>
          <Label htmlFor={id} className="FormInputFieldLabel">
            {label}
          </Label>
        </Skeleton>
        <Skeleton loading={loading} width="100%" height={25}>
          <input
            ref={ref}
            id={id}
            className={clsx(
              "FormInputFieldInput",
              error && "FormInputFieldInputError",
            )}
            {...props}
          />
        </Skeleton>
        {error ? (
          <span className="FormInputFieldError">{error.message}</span>
        ) : undefined}
      </div>
    );
  },
);
