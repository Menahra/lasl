import { Trans } from "@lingui/react/macro";
import { LegalDocumentLayout } from "@/src/app/layouts/legal-document-layout/LegalDocumentLayout.tsx";
import { LegalDocumentSection } from "@/src/app/layouts/legal-document-layout/LegalDocumentSection.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";

export const ImprintPage = () => {
  const lastUpdated = new Date("2025-12-19");

  return (
    <LegalDocumentLayout
      title={<Trans>Imprint</Trans>}
      lastUpdate={lastUpdated}
    >
      <LegalDocumentSection title={<Trans>Service Provider</Trans>}>
        <p>
          <Trans>
            {`${PROJECT_INFORMATION.author.firstName} ${PROJECT_INFORMATION.author.lastName}`}
            <br />
            {`${PROJECT_INFORMATION.author.address.street} ${PROJECT_INFORMATION.author.address.housenumber}`}
            <br />
            {`${PROJECT_INFORMATION.author.address.zip} ${PROJECT_INFORMATION.author.address.city}`}
            <br />
            {PROJECT_INFORMATION.author.address.country}
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Contact</Trans>}>
        <p>
          <Trans>
            There is currently no direct email contact available. Please use the
            contact options provided within the platform.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Responsible for Content</Trans>}>
        <p>
          <Trans>Responsible for content according to § 55 Abs. 2 RStV:</Trans>
        </p>
        <p>
          <Trans>
            {`${PROJECT_INFORMATION.author.firstName} ${PROJECT_INFORMATION.author.lastName}`}
            <br />
            {`${PROJECT_INFORMATION.author.address.street} ${PROJECT_INFORMATION.author.address.housenumber}`}
            <br />
            {`${PROJECT_INFORMATION.author.address.zip} ${PROJECT_INFORMATION.author.address.city}`}
            <br />
            {PROJECT_INFORMATION.author.address.country}
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Responsibility for Content</Trans>}>
        <p>
          <Trans>
            As the service provider, we are responsible for our own content on
            these pages in accordance with applicable laws.
          </Trans>
        </p>
        <p>
          <Trans>
            However, we are not obligated to monitor transmitted or stored
            third-party information or to actively investigate circumstances
            that indicate illegal activity.
          </Trans>
        </p>
        <p>
          <Trans>
            Obligations to remove or block the use of information under general
            laws remain unaffected. Liability in this regard is only possible
            from the point in time at which a specific infringement becomes
            known. Upon becoming aware of such violations, we will remove the
            content immediately.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Non-Commercial Notice</Trans>}>
        <p>
          <Trans>
            This website is operated as a private, non-commercial hobby project.
            No commercial services are offered. No intention of profit exists.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Liability for Content</Trans>}>
        <p>
          <Trans>
            The contents of this website have been created with the greatest
            possible care. However, no guarantee is given for the accuracy,
            completeness, or timeliness of the content.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Liability for Links</Trans>}>
        <p>
          <Trans>
            This website may contain links to external third-party websites. We
            have no influence over the contents of those websites and therefore
            assume no liability for external content.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Copyright</Trans>}>
        <p>
          <Trans>
            Content and works created by the site operator on this website are
            subject to copyright law. Duplication, processing, distribution, or
            any form of commercialization requires prior written consent.
          </Trans>
        </p>
      </LegalDocumentSection>
    </LegalDocumentLayout>
  );
};
