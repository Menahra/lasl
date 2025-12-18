import type { PropsWithChildren, ReactNode } from "react";
import "./LegalDocumentSection.css";

type LegalDocumentSectionProps = PropsWithChildren<{
  title: ReactNode;
}>;

export const LegalDocumentSection = ({
  title,
  children,
}: LegalDocumentSectionProps) => {
  return (
    <section className="LegalDocumentSection">
      <h2 className="LegalDocumentSectionTitle">{title}</h2>
      {children}
    </section>
  );
};
