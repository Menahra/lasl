import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";
import "./Button.css";

const ButtonVariants = {
  primary: "Button--primary",
  secondary: "Button--secondary",
  text: "Button--text",
} as const;
const ButtonAlignments = {
  start: "Button--alignStart",
  center: "Button--alignCenter",
  end: "Button--alignEnd",
} as const;

type ButtonProps = PropsWithChildren<{
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: keyof typeof ButtonVariants;
  align?: keyof typeof ButtonAlignments;
  fullWidth?: boolean;
  type?: HTMLButtonElement["type"];
  loading?: boolean;
  onClick?: () => void;
}>;

export const Button = ({
  startIcon,
  endIcon,
  variant = "primary",
  align = "start",
  fullWidth = false,
  children,
  type = "button",
  loading = false,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        "Button",
        ButtonVariants[variant],
        !loading && ButtonAlignments[align],
        fullWidth && "Button--fullWidth",
        loading && "Button--loading",
        loading && ButtonAlignments.center,
      )}
      onClick={loading ? undefined : onClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <span className="ButtonSpinner" aria-hidden="true" />
      ) : undefined}
      {!loading && startIcon ? (
        <span className="ButtonIcon">{startIcon}</span>
      ) : undefined}
      {children}
      {!loading && endIcon ? (
        <span className="ButtonIcon">{endIcon}</span>
      ) : undefined}
    </button>
  );
};
