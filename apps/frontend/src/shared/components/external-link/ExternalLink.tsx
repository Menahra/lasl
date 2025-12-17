import type { PropsWithChildren } from "react";

export type ExternalLinkProps = PropsWithChildren<
  Pick<HTMLAnchorElement, "href"> &
    Partial<Pick<HTMLAnchorElement, "ariaLabel" | "className">>
>;

export const ExternalLink = ({
  children,
  ...anchorProps
}: ExternalLinkProps) => (
  <a {...anchorProps} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);
