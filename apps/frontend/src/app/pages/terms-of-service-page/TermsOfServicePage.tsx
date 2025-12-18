import { Trans } from "@lingui/react/macro";
import { LegalDocumentLayout } from "@/src/app/layouts/legal-document-layout/LegalDocumentLayout.tsx";
import { LegalDocumentSection } from "@/src/app/layouts/legal-document-layout/LegalDocumentSection.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";

export const TermsOfServicePage = () => {
  const lastUpdated = new Date("2025-12-18");
  return (
    <LegalDocumentLayout
      title={<Trans>Terms of Service</Trans>}
      lastUpdate={lastUpdated}
    >
      <LegalDocumentSection title={<Trans>Service Provider</Trans>}>
        <p>
          <Trans>
            This service is provided by{" "}
            {`${PROJECT_INFORMATION.author.firstName} ${PROJECT_INFORMATION.author.lastName}`}
            , with his registered address at{" "}
            {`${PROJECT_INFORMATION.author.address.street} ${PROJECT_INFORMATION.author.address.housenumber}, ${PROJECT_INFORMATION.author.address.zip} ${PROJECT_INFORMATION.author.address.city} (${PROJECT_INFORMATION.author.address.country})`}
            .
          </Trans>
        </p>
        <p>
          <Trans>
            This project is operated as a non-commercial, experimental hobby
            project.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Agreement to Terms</Trans>}>
        <p>
          <Trans>
            By accessing or using {PROJECT_INFORMATION.name}, you agree to be
            bound by these Terms of Service and all applicable laws and
            regulations. If you do not agree with any of these terms, you are
            prohibited from using this platform.
          </Trans>
        </p>
        <p>
          <Trans>
            These Terms apply upon registration and continued use of the
            service.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Use License</Trans>}>
        <p>
          <Trans>
            Permission is granted to temporarily access the materials on
            {PROJECT_INFORMATION.name} for personal, non-commercial use only.
            This is the grant of a license, not a transfer of title, and under
            this license you may not:
          </Trans>
        </p>
        <ul>
          <Trans>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>
              Attempt to reverse engineer any software contained on{" "}
              {PROJECT_INFORMATION.name}
            </li>
            <li>
              Remove any copyright or proprietary notations from the materials
            </li>
            <li>
              Transfer the materials to another person or "mirror" the materials
              on any other server
            </li>
          </Trans>
        </ul>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>User Accounts</Trans>}>
        <p>
          <Trans>
            When you create an account with us, you must provide accurate,
            complete, and current information. Failure to do so constitutes a
            breach of the Terms, which may result in immediate termination of
            your account.
          </Trans>
        </p>
        <p>
          <Trans>
            You are responsible for safeguarding the password that you use to
            access the platform and for any activities or actions under your
            password.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Termination</Trans>}>
        <p>
          <Trans>
            We may suspend or terminate your access to{" "}
            {PROJECT_INFORMATION.name} immediately, without prior notice, if you
            breach these Terms or applicable laws.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Intellectual Property</Trans>}>
        <p>
          <Trans>
            All content, features, and functionality on{" "}
            {PROJECT_INFORMATION.name}, including but not limited to text,
            graphics, logos, and software, are the exclusive property of{" "}
            {PROJECT_INFORMATION.name} and are protected by international
            copyright, trademark, and other intellectual property laws.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Learning Content</Trans>}>
        <p>
          <Trans>
            The language learning materials provided on{" "}
            {PROJECT_INFORMATION.name} are for educational purposes. While we
            strive for accuracy, we make no guarantees about the completeness or
            accuracy of the content. Users should verify important information
            independently.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Limitation of Liability</Trans>}>
        <p>
          <Trans>
            To the extent permitted by applicable law,{" "}
            {PROJECT_INFORMATION.name} shall not be liable for any indirect,
            incidental, special, or consequential damages arising out of or in
            connection with the use or inability to use the service.
          </Trans>
        </p>
        <p>
          <Trans>
            This limitation of liability does not apply in cases of intent,
            gross negligence, or where liability is mandatory under applicable
            consumer protection laws.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Consumer Rights</Trans>}>
        <p>
          <Trans>
            If you are a consumer residing in the European Union, you benefit
            from mandatory consumer protection rights under applicable EU and
            national laws. Nothing in these Terms limits or excludes those
            rights.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Modifications</Trans>}>
        <p>
          <Trans>
            {PROJECT_INFORMATION.name} may revise these Terms of Service at any
            time without notice. By using this platform, you agree to be bound
            by the current version of these Terms of Service.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection
        title={<Trans>Governing Law and Jurisdiction</Trans>}
      >
        <p>
          <Trans>
            These Terms shall be governed by the laws of Germany, excluding its
            conflict-of-law provisions.
          </Trans>
        </p>
        <p>
          <Trans>
            If you are a consumer, this choice of law does not deprive you of
            the protection afforded by mandatory provisions of the law of your
            country of residence.
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Privacy and Data Protection</Trans>}>
        <p>
          <Trans>
            The processing of personal data is governed by our{" "}
            <TextLink to="/privacy" variant="primary">
              Privacy Policy
            </TextLink>
            , which explains how we collect, use, and protect your personal
            information in accordance with the General Data Protection
            Regulation (GDPR).
          </Trans>
        </p>
      </LegalDocumentSection>
      <LegalDocumentSection title={<Trans>Contact Us</Trans>}>
        <p>
          <Trans>There is no E-Mail available yet. Stay tuned.</Trans>
        </p>
      </LegalDocumentSection>
    </LegalDocumentLayout>
  );
};
