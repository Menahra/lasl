import type { AnchorHTMLAttributes, PropsWithChildren } from "react";

export type ExternalLinkProps = PropsWithChildren<
  Pick<HTMLAnchorElement, "href"> &
    Partial<
      Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "aria-label" | "className">
    >
>;

export const ExternalLink = ({
  children,
  ...anchorProps
}: ExternalLinkProps) => (
  <a {...anchorProps} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);
