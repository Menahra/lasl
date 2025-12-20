import { Trans } from "@lingui/react/macro";
import { ROUTE_IMPRINT } from "@/src/app/routes/imprint.tsx";
import { ROUTE_PRIVACY_POLICY } from "@/src/app/routes/privacy.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
import { BrandLogo } from "@/src/shared/components/brand-logo/BrandLogo.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./Footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isLoading } = useI18nContext();
  return (
    <footer className="MainLayoutFooter">
      <div className="MainLayoutFooterLinkContainer">
        <div className="MainLayoutFooterLinkColumn">
          <div className="MainLayoutFooterLinkProjectColumnTitleWrapper">
            <BrandLogo variant="footer" />
            <h3 className="MainLayoutFooterLinkProjectColumnTitle">
              {PROJECT_INFORMATION.name}
            </h3>
          </div>
          <Skeleton loading={isLoading} width="90%" height={52}>
            <p>
              <Trans>
                Master فصحى, the standard arabic language used in the Qur'an,
                literature, and news.
              </Trans>
            </p>
          </Skeleton>
        </div>
        <div className="MainLayoutFooterLinkColumn">
          <Skeleton loading={isLoading} width={70} height={21}>
            <h4 className="MainLayoutFooterLinkColumnTitle">
              <Trans>Legal</Trans>
            </h4>
          </Skeleton>
          <ul className="MainLayoutFooterLinkColumnList">
            <li>
              <Skeleton loading={isLoading} width={130} height={17}>
                <TextLink variant="primary" to={ROUTE_PRIVACY_POLICY}>
                  <Trans>Privacy Policy</Trans>
                </TextLink>
              </Skeleton>
            </li>
            <li>
              <Skeleton loading={isLoading} width={160} height={17}>
                <TextLink variant="primary" to={ROUTE_TERMS_OF_SERVICE}>
                  <Trans>Terms of Service</Trans>
                </TextLink>
              </Skeleton>
            </li>
            <li>
              <Skeleton loading={isLoading} width={80} height={17}>
                <TextLink variant="primary" to={ROUTE_IMPRINT}>
                  <Trans>Imprint</Trans>
                </TextLink>
              </Skeleton>
            </li>
          </ul>
        </div>
        <div className="MainLayoutFooterLinkColumn">
          <Skeleton loading={isLoading} width={80} height={21}>
            <h4 className="MainLayoutFooterLinkColumnTitle">
              <Trans>Resources</Trans>
            </h4>
          </Skeleton>
          <ul className="MainLayoutFooterLinkColumnList">
            <li>
              <Skeleton loading={isLoading} width={130} height={17}>
                <TextLink variant="primary">
                  <Trans>Contact Form??</Trans>
                </TextLink>
              </Skeleton>
            </li>
          </ul>
        </div>
      </div>
      <div className="MainLayoutFooterCopyright">
        <Skeleton loading={isLoading} width={260} height={17}>
          <Trans>
            © {currentYear} {PROJECT_INFORMATION.name}. All rights reserved.
          </Trans>
        </Skeleton>
      </div>
    </footer>
  );
};
