import type { PropsWithChildren, ReactNode } from "react";
import "./SettingsCard.css";

export type SettingsCardProps = PropsWithChildren<{
  title: string;
  description?: string;
  footer?: ReactNode;
}>;

export const SettingsCard = ({
  title,
  description,
  children,
  footer,
}: SettingsCardProps) => {
  return (
    <section className="SettingsCard">
      <div className="SettingsCardHeader">
        <h3 className="SettingsCardTitle">{title}</h3>
        {description ? (
          <p className="SettingsCardDescription">{description}</p>
        ) : null}
      </div>
      <div className="SettingsCardBody">{children}</div>
      {footer ? <div className="SettingsCardFooter">{footer}</div> : null}
    </section>
  );
};
