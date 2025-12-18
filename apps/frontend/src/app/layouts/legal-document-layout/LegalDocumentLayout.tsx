import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import type { PropsWithChildren, ReactNode } from "react";
import { MainLayout } from "@/src/app/layouts/main-layout/MainLayout.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import "./LegalDocumentLayout.css";

type LegalDocumentLayoutProps = PropsWithChildren<{
  /* the title of the document  */
  title: ReactNode;
  /* the date of the last update of the legal document */
  lastUpdate: Date;
}>;

export const LegalDocumentLayout = ({
  title,
  lastUpdate,
  children,
}: LegalDocumentLayoutProps) => {
  const { i18n } = useLingui();

  return (
    <MainLayout>
      <div className="LegalDocumentLayout">
        <TanstackRouterLink to="/">
          <Button variant="text" startIcon={<ArrowLeftIcon />}>
            <Trans>Back to Home</Trans>
          </Button>
        </TanstackRouterLink>
        <article className="LegalDocumentArticle">
          <header>
            <h1 className="LegalDocumentArticleTitle">{title}</h1>
            <p>
              <Trans>Last updated: {i18n.date(lastUpdate)}</Trans>
            </p>
          </header>
          {children}
        </article>
      </div>
    </MainLayout>
  );
};
