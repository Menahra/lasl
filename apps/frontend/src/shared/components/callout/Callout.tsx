import { Cross2Icon } from "@radix-ui/react-icons";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import {
  CALLOUT_SEVERITIES,
  CALLOUT_VARIANTS,
  type CalloutSeverity,
  type CalloutVariant,
} from "@/src/shared/components/callout/calloutConfig.ts";
import "./Callout.css";

type CalloutProps = PropsWithChildren<{
  severity?: CalloutSeverity;
  variant?: CalloutVariant;
  onClose?: () => void;
}>;

export const Callout = ({
  severity = "info",
  variant = "outlined",
  children,
  onClose,
}: CalloutProps) => {
  const { icon: Icon, className: severityClass } = CALLOUT_SEVERITIES[severity];

  return (
    <div
      role="alert"
      className={clsx("Callout", severityClass, CALLOUT_VARIANTS[variant])}
    >
      <span className="CalloutIcon">
        <Icon />
      </span>
      <div className="CalloutContent">{children}</div>
      {onClose && (
        <button
          type="button"
          className="CalloutCloseButton"
          aria-label="Dismiss notification"
          onClick={onClose}
        >
          <Cross2Icon />
        </button>
      )}
    </div>
  );
};
