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
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        "Button",
        ButtonVariants[variant],
        ButtonAlignments[align],
        fullWidth && "Button--fullWidth",
      )}
      onClick={onClick}
    >
      {startIcon ? <span className="ButtonIcon">{startIcon}</span> : undefined}
      {children}
      {endIcon ? <span className="ButtonIcon">{endIcon}</span> : undefined}
    </button>
  );
};
