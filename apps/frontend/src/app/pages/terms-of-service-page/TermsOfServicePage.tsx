import { Trans } from "@lingui/react";
import { useLingui } from "@lingui/react/macro";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { MainLayout } from "@/src/app/layouts/main-layout/MainLayout.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import "./TermsOfServicePage.css";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok for static pages
export const TermsOfServicePage = () => {
  const { i18n } = useLingui();
  const lastUpdated = new Date("2025-12-18");
  return (
    <MainLayout>
      <div className="TermsOfServicePage">
        <TanstackRouterLink to="/">
          <Button variant="text" startIcon={<ArrowLeftIcon />}>
            <Trans id="common.back.to.home" message="Back to Home" />
          </Button>
        </TanstackRouterLink>
        <article className="TermsOfServicePageArticle">
          <header>
            <h1 className="TermsOfServicePageArticleTitle">
              <Trans id="terms.title" message="Terms of Service" />
            </h1>
            <p>
              <Trans
                id="terms.last.update"
                message={`Last updated: ${i18n.date(lastUpdated)}`}
              />
            </p>
          </header>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.provider.section.title"
                message="Service Provider"
              />
            </h2>
            <p>
              <Trans
                id="terms.provider.section.content"
                message="This service is provided by {firstName} {lastName}, with his registered address at {street} {housenumber}, {zip} {city} ({country})."
                values={{
                  firstName: PROJECT_INFORMATION.author.firstName,
                  lastName: PROJECT_INFORMATION.author.lastName,
                  street: PROJECT_INFORMATION.author.address.street,
                  housenumber: PROJECT_INFORMATION.author.address.housenumber,
                  zip: PROJECT_INFORMATION.author.address.zip,
                  city: PROJECT_INFORMATION.author.address.city,
                  country: PROJECT_INFORMATION.author.address.country,
                }}
              />
            </p>
            <p>
              <Trans
                id="terms.provider.section.disclaimer"
                message="This project is operated as a non-commercial, experimental hobby
                project."
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.agreement.section.title"
                message="Agreement to Terms"
              />
            </h2>
            <p>
              <Trans
                id="terms.agreement.section.content"
                message="By accessing or using {projectName}, you agree to
                be bound by these Terms of Service and all applicable laws and
                regulations. If you do not agree with any of these terms, you
                are prohibited from using this platform."
                values={{ projectName: PROJECT_INFORMATION.name }}
              />
            </p>
            <p>
              <Trans
                id="terms.agreement.section.disclaimer"
                message="These Terms apply upon registration and continued use of the
                service."
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans id="terms.license.section.title" message="Use License" />
            </h2>
            <p>
              <Trans
                id="terms.license.section.explanation"
                message="Permission is granted to temporarily access the materials on
                {projectName} for personal, non-commercial use
                only. This is the grant of a license, not a transfer of title,
                and under this license you may not:"
                values={{ projectName: PROJECT_INFORMATION.name }}
              />
            </p>
            <ul>
              <li>
                <Trans
                  id="terms.license.section.item.modify"
                  message="Modify or copy the materials"
                />
              </li>
              <li>
                <Trans
                  id="terms.license.section.item.commercial"
                  message="Use the materials for any commercial purpose"
                />
              </li>
              <li>
                <Trans
                  id="terms.license.section.item.reverse.engineer"
                  message="Attempt to reverse engineer any software contained on 
                {projectName}"
                  values={{ projectName: PROJECT_INFORMATION.name }}
                />
              </li>
              <li>
                <Trans
                  id="terms.license.section.item.copyright"
                  message="Remove any copyright or proprietary notations from the materials"
                />
              </li>
              <li>
                <Trans
                  id="terms.license.section.item.transfer"
                  message='Transfer the materials to another person or "mirror" the
                materials on any other server'
                />
              </li>
            </ul>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.accounts.section.title"
                message="User Accounts"
              />
            </h2>
            <p>
              <Trans
                id="terms.accounts.section.content"
                message="When you create an account with us, you must provide accurate,
                complete, and current information. Failure to do so constitutes
                a breach of the Terms, which may result in immediate termination
                of your account."
              />
            </p>
            <p>
              <Trans
                id="terms.accounts.section.responsibility"
                message="You are responsible for safeguarding the password that you use
                to access the platform and for any activities or actions under
                your password."
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.termination.section.title"
                message="Termination"
              />
            </h2>
            <p>
              <Trans
                id="terms.termination.section.content"
                message="We may suspend or terminate your access to
                {projectName} immediately, without prior notice, if
                you breach these Terms or applicable laws."
                values={{ projectName: PROJECT_INFORMATION.name }}
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.intellectual.section.title"
                message="Intellectual Property"
              />
            </h2>
            <p>
              <Trans
                id="terms.intellectual.section.content"
                message="All content, features, and functionality on 
                {projectName}, including but not limited to text,
                graphics, logos, and software, are the exclusive property of 
                {projectName} and are protected by international
                copyright, trademark, and other intellectual property laws."
                values={{ projectName: PROJECT_INFORMATION.name }}
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.learning.section.title"
                message="Learning Content"
              />
            </h2>
            <p>
              <Trans
                id="terms.learning.section.content"
                message="The language learning materials provided on 
                {projectName} are for educational purposes. While
                we strive for accuracy, we make no guarantees about the
                completeness or accuracy of the content. Users should verify
                important information independently."
                values={{ projectName: PROJECT_INFORMATION.name }}
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.liability.section.title"
                message="Limitation of Liability"
              />
            </h2>
            <p>
              <Trans
                id="terms.liability.section.content"
                message="To the extent permitted by applicable law, 
                {projectName} shall not be liable for any indirect,
                incidental, special, or consequential damages arising out of or
                in connection with the use or inability to use the service."
                values={{ projectName: PROJECT_INFORMATION.name }}
              />
            </p>
            <p>
              <Trans
                id="terms.liability.section.disclaimer"
                message="This limitation of liability does not apply in cases of intent,
                gross negligence, or where liability is mandatory under
                applicable consumer protection laws."
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.consumer.section.title"
                message="Consumer Rights"
              />
            </h2>
            <p>
              <Trans
                id="terms.consumer.section.content"
                message="If you are a consumer residing in the European Union, you
                benefit from mandatory consumer protection rights under
                applicable EU and national laws. Nothing in these Terms limits
                or excludes those rights."
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.modifications.section.title"
                message="Modifications"
              />
            </h2>
            <p>
              <Trans
                id="terms.modifications.section.content"
                message="{projectName} may revise these Terms of Service at
                any time without notice. By using this platform, you agree to be
                bound by the current version of these Terms of Service."
                values={{ projectName: PROJECT_INFORMATION.name }}
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.jurisdiction.section.title"
                message="Governing Law and Jurisdiction"
              />
            </h2>
            <p>
              <Trans
                id="terms.jurisdiction.section.author.country"
                message="These Terms shall be governed by the laws of {country}, excluding
                its conflict-of-law provisions."
                values={{ country: PROJECT_INFORMATION.author.address.country }}
              />
            </p>
            <p>
              <Trans
                id="terms.jurisdiction.section.consumser.law"
                message="If you are a consumer, this choice of law does not deprive you
                of the protection afforded by mandatory provisions of the law of
                your country of residence."
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans
                id="terms.data.section.title"
                message="Privacy and Data Protection"
              />
            </h2>
            <p>
              <Trans
                id="terms.data.section.content"
                components={{
                  link: <TextLink to="/privacypolicy" variant="primary" />,
                }}
                message="The processing of personal data is governed by our{' '}
                <link>Privacy Policy</link>, which explains how we collect, use, and
                protect your personal information in accordance with the General
                Data Protection Regulation (GDPR)."
              />
            </p>
          </section>

          <section className="TermsOfServicePageArticleSection">
            <h2 className="TermsOfServicePageArticleSectionTitle">
              <Trans id="terms.contact.section.title" message="Contact Us" />
            </h2>
            <p>
              <Trans
                id="terms.contact.section.content"
                message="There is no E-Mail available yet. Stay tuned."
              />
            </p>
          </section>
        </article>
      </div>
    </MainLayout>
  );
};
