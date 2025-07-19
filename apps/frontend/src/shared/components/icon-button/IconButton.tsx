import type { PropsWithChildren } from "react";
import "./styles.scss";
import { Tooltip, type TooltipProps } from "../tooltip/Tooltip.jsx";

type IconButtonProps = Omit<TooltipProps, "children"> & {
  /**
   * the accessible description
   * it should explain the purpose this button fulfills
   */
  description: string;
  /** the icon for this button */
  icon: PropsWithChildren["children"];

  /** handler will be executed when the button is being pressed */
  onClick: () => void;
};

export const IconButton = ({
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
        className="IconButton"
        aria-label={description}
      >
        {icon}
      </button>
    </Tooltip>
  );
};
