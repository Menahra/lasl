import { Trans } from "@lingui/react/macro";
import { LegalDocumentLayout } from "@/src/app/layouts/legal-document-layout/LegalDocumentLayout.tsx";
import { LegalDocumentSection } from "@/src/app/layouts/legal-document-layout/LegalDocumentSection.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";

export const PrivacyPolicyPage = () => {
  const lastUpdated = new Date("2025-12-18");

  return (
    <LegalDocumentLayout
      title={<Trans>Privacy Policy</Trans>}
      lastUpdate={lastUpdated}
    >
      <LegalDocumentSection title={<Trans>Introduction</Trans>}>
        <p>
          <Trans>
            We respect your privacy and are committed to protecting your
            personal data. This Privacy Policy explains how we collect, use, and
            protect your personal data when you use {PROJECT_INFORMATION.name},
            as well as your rights under the General Data Protection Regulation
            (GDPR).
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Data Controller</Trans>}>
        <p>
          <Trans>
            The data controller responsible for the processing of personal data
            within the meaning of the GDPR is:
          </Trans>
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

      <LegalDocumentSection title={<Trans>Data We Collect</Trans>}>
        <p>
          <Trans>
            We collect and process the following categories of data:
          </Trans>
        </p>
        <ul>
          <Trans>
            <li>Identity data (such as name and email address)</li>
            <li>Usage data (information about how you use the platform)</li>
            <li>
              Technical data (such as IP address, browser type, and device
              information)
            </li>
          </Trans>
        </ul>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Purposes of Processing</Trans>}>
        <p>
          <Trans>Your personal data is used for the following purposes:</Trans>
        </p>
        <ul>
          <Trans>
            <li>Providing and maintaining the platform</li>
            <li>Tracking learning progress and personalizing the experience</li>
            <li>Improving the platform and developing new features</li>
            <li>Ensuring security and preventing misuse</li>
            <li>Complying with legal obligations</li>
          </Trans>
        </ul>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Legal Basis for Processing</Trans>}>
        <p>
          <Trans>
            We process personal data on the following legal bases in accordance
            with Art. 6 GDPR:
          </Trans>
        </p>
        <ul>
          <Trans>
            <li>
              Performance of a contract (Art. 6(1)(b) GDPR), where processing is
              necessary to provide user accounts and learning services
            </li>
            <li>
              Legitimate interests (Art. 6(1)(f) GDPR), in particular to ensure
              the security and stability of the platform
            </li>
            <li>
              Legal obligations (Art. 6(1)(c) GDPR), where processing is
              required by applicable law
            </li>
            <li>
              Consent (Art. 6(1)(a) GDPR), where you have explicitly given
              consent
            </li>
          </Trans>
        </ul>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Data Retention</Trans>}>
        <p>
          <Trans>
            We store personal data only for as long as necessary to fulfill the
            purposes for which it was collected.
          </Trans>
        </p>
        <ul>
          <Trans>
            <li>Account data is retained for the duration of the account</li>
            <li>
              Learning progress data is deleted when the account is deleted
            </li>
            <li>
              Technical and log data is retained for a limited period for
              security purposes
            </li>
          </Trans>
        </ul>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Data Sharing and Recipients</Trans>}>
        <p>
          <Trans>
            We do not sell or rent personal data. Personal data is not shared
            with third parties, except where required by law or where technical
            service providers are used to operate the platform under data
            processing agreements.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>International Data Transfers</Trans>}>
        <p>
          <Trans>
            Personal data is processed exclusively within the European Union. No
            transfer of personal data to third countries takes place.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Data Security</Trans>}>
        <p>
          <Trans>
            Appropriate technical and organizational measures are implemented to
            protect personal data against accidental or unlawful loss,
            alteration, or unauthorized access.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Your Rights</Trans>}>
        <p>
          <Trans>
            Under the GDPR, you have the right to access, correct, delete, or
            restrict the processing of your personal data. You also have the
            right to data portability and to object to certain processing
            activities.
          </Trans>
        </p>
        <p>
          <Trans>
            Where processing is based on consent, you may withdraw your consent
            at any time. You also have the right to lodge a complaint with a
            supervisory authority.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Automated Decision-Making</Trans>}>
        <p>
          <Trans>
            We do not use automated decision-making or profiling within the
            meaning of Art. 22 GDPR.
          </Trans>
        </p>
      </LegalDocumentSection>

      <LegalDocumentSection title={<Trans>Contact</Trans>}>
        <p>
          <Trans>
            If you have any questions about this Privacy Policy or the
            processing of your personal data, please contact us. There is no
            dedicated privacy email available yet.
          </Trans>
        </p>
      </LegalDocumentSection>
    </LegalDocumentLayout>
  );
};

// footer für main layout, mit kleinen links für impressum, etc
// search feld kleiner im header
// login/ signup button
// macht es sinn im localstorage sich zu merken ob user schon account hat und entsprechend
// entweder login oder signup button anzuzeigen?
