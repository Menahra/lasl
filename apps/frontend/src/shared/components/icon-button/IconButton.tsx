import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { Tooltip, type TooltipProps } from "../tooltip/Tooltip.tsx";

export type IconButtonProps = Omit<TooltipProps, "children"> & {
  /**
   * the accessible description
   * it should explain the purpose this button fulfills
   */
  description: string;
  /** the icon for this button */
  icon: PropsWithChildren["children"];
  /** className of the button */
  className?: string;

  /** handler will be executed when the button is being pressed */
  onClick: () => void;
};

export const IconButton = ({
  className,
  description,
  icon,
  onClick,
  ...tooltipProps
}: IconButtonProps) => {
  return (
    <Tooltip {...tooltipProps}>
      <button
        type="button"
        onClick={onClick}
        className={clsx("IconButton", className)}
        aria-label={description}
      >
        {icon}
      </button>
    </Tooltip>
  );
};
