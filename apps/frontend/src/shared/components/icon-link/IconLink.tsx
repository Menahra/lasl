import clsx from "clsx";
import type { ReactNode } from "react";
import {
  ExternalLink,
  type ExternalLinkProps,
} from "@/src/shared/components/external-link/ExternalLink.tsx";
import { Tooltip } from "@/src/shared/components/tooltip/Tooltip.tsx";
import "./IconLink.css";

export type IconLinkProps = Pick<ExternalLinkProps, "href" | "ariaLabel"> & {
  className?: string;
  icon: ReactNode;
  /** if this is given it will be shown in a tooltip */
  title?: string;
};

export const IconLink = ({
  className,
  icon,
  title,
  ...anchorProps
}: IconLinkProps) => (
  <Tooltip title={title}>
    <ExternalLink {...anchorProps} className={clsx("IconButton", className)}>
      {icon}
    </ExternalLink>
  </Tooltip>
);
