import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";
import "./Button.css";

const ButtonVariants = {
  primary: "Button--primary",
  secondary: "Button--secondary",
  text: "Button--text",
};

type ButtonProps = PropsWithChildren<{
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: keyof typeof ButtonVariants;
  fullWidth?: boolean;
  type?: HTMLButtonElement["type"];
  onClick?: () => void;
}>;

export const Button = ({
  startIcon,
  endIcon,
  variant = "primary",
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
