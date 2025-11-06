import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Tooltip } from "../tooltip/Tooltip.tsx";

type IconLinkProps = Pick<
  AnchorHTMLAttributes<unknown>,
  "href" | "target" | "rel" | "aria-label"
> & {
  icon: ReactNode;
  /** if this is given it will be shown in a tooltip */
  title?: string;
};

export const IconLink = ({ icon, title, ...anchorProps }: IconLinkProps) => (
  <Tooltip title={title}>
    <a {...anchorProps} className="IconLink">
      {icon}
    </a>
  </Tooltip>
);
