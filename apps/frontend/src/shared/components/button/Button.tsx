import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";
import "./styles.css";

type ButtonProps = PropsWithChildren<{
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: "primary" | "secondary" | "text";
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
  const finalVariant = `${variant.charAt(0).toUpperCase()}${variant.slice(1)}`;
  return (
    <button
      type={type}
      className={clsx(
        "Button",
        `${finalVariant}Button`,
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
