import { Trans } from "@lingui/react/macro";
import {
  AccessibilityIcon,
  ChatBubbleIcon,
  FileTextIcon,
  GlobeIcon,
  ListBulletIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { MainLayout } from "@/src/app/layouts/main-layout/MainLayout.tsx";
import { LandingPageFeatureCard } from "@/src/app/pages/landing-page/LandingPageFeatureCard.tsx";
import { LandingPageHighlightCard } from "@/src/app/pages/landing-page/LandingPageHighlightCard.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { ROUTE_SIGN_UP } from "@/src/app/routes/register/index.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./LandingPage.css";

export const LandingPage = () => {
  const { isLoading } = useI18nContext();

  return (
    <MainLayout>
      <section className="LandingPageTitleSection">
        <h1 className="LandingPageTitleArabic">
          <Skeleton loading={isLoading} width={320} height={80}>
            العربية الفصحى
          </Skeleton>
        </h1>

        <h2 className="LandingPageSubTitle">
          <Skeleton loading={isLoading} width={485} height={45}>
            <Trans>Master Classical Arabic (Fusha)</Trans>
          </Skeleton>
        </h2>
        <p className="LandingPageProjectGoal">
          <Skeleton loading={isLoading} width={670} height={21}>
            <Trans>
              An open, community-driven platform for learning Modern Standard
              Arabic. Explore Nahw, Sarf, Balagha, and more — with content you
              can help improve.
            </Trans>
          </Skeleton>
        </p>
        <div className="LandingPageAuthActionWrapper">
          <Skeleton loading={isLoading} width={209} height={50}>
            <TanstackRouterLink to={ROUTE_SIGN_UP}>
              <Button variant="primary">
                <Trans>Start Learning Free</Trans>
              </Button>
            </TanstackRouterLink>
          </Skeleton>
          <Skeleton loading={isLoading} width={118} height={50}>
            <TanstackRouterLink to={ROUTE_LOGIN}>
              <Button variant="secondary">
                <Trans>Sign In</Trans>
              </Button>
            </TanstackRouterLink>
          </Skeleton>
        </div>
      </section>
      <section className="LandingPageSection">
        <h3 className="LandingPageSectionTitle">
          <Skeleton loading={isLoading} width={230} height={32}>
            <Trans>What You Will Learn</Trans>
          </Skeleton>
        </h3>
        <div className="LandingPageLearnOverviewHighlightWrapper">
          <LandingPageHighlightCard
            title="النهو (Nahw)"
            description={<Trans>Arabic Grammar & Syntax</Trans>}
          />
          <LandingPageHighlightCard
            title="الصرف (Sarf)"
            description={<Trans>Morphology & Word Patterns</Trans>}
          />
          <LandingPageHighlightCard
            title="البلاغة (Balagha)"
            description={<Trans>Rhetoric & Eloquence</Trans>}
          />
        </div>
      </section>
      <section className="LandingPageSection">
        <h3 className="LandingPageSectionTitle">
          <Trans>Why {PROJECT_INFORMATION.name}?</Trans>
        </h3>
        <div className="LandingPageMotivationFeatureWrapper">
          <LandingPageFeatureCard
            icon={<ListBulletIcon />}
            title={<Trans>Structured Curriculum</Trans>}
            description={
              <Trans>
                Carefully organized lessons covering grammar, morphology, and
                rhetoric progressively.
              </Trans>
            }
          />
          <LandingPageFeatureCard
            icon={<Pencil1Icon />}
            title={<Trans>Community-Driven Content</Trans>}
            description={
              <Trans>
                All content is stored as JSON documents that contributors can
                edit and improve.
              </Trans>
            }
            planned={true}
          />
          <LandingPageFeatureCard
            icon={<FileTextIcon />}
            title={<Trans>Open & Transparent</Trans>}
            description={
              <Trans>
                View, suggest changes, and contribute to the learning materials
                directly.
              </Trans>
            }
          />
          <LandingPageFeatureCard
            icon={<GlobeIcon />}
            title={<Trans>Multi-Language Interface</Trans>}
            description={
              <Trans>
                Learn in English, with German, French, and more languages coming
                soon.
              </Trans>
            }
            planned={true}
          />
          <LandingPageFeatureCard
            icon={<ChatBubbleIcon />}
            title={<Trans>Collaborative Learning</Trans>}
            description={
              <Trans>
                Join a community of learners and contributors passionate about
                Arabic.
              </Trans>
            }
          />
          <LandingPageFeatureCard
            icon={<AccessibilityIcon />}
            title={<Trans>Accessible Everywhere</Trans>}
            description={
              <Trans>
                Learn on any device with a responsive, accessible design.
              </Trans>
            }
          />
        </div>
      </section>
      <section className="LandingPageStartJourneySection">
        <div className="LandingPageStartJourneySectionContainer">
          <h3 className="LandingPageStartJourneySectionTitle">
            <Skeleton loading={isLoading} width={300} height={38}>
              <Trans>Ready to Begin Your Arabic Journey?</Trans>
            </Skeleton>
          </h3>
          <p className="LandingPageStartJourneySectionText">
            <Skeleton loading={isLoading} width={350} height={26}>
              <Trans>
                Join learners and contributors shaping the future of Arabic
                language education.
              </Trans>
            </Skeleton>
          </p>
          <Skeleton loading={isLoading} width={170} height={50}>
            <TanstackRouterLink
              to={ROUTE_SIGN_UP}
              className="LandingPageAuthActionWrapper"
            >
              <Button variant="primary">
                <Trans>Create Your Free Account</Trans>
              </Button>
            </TanstackRouterLink>
          </Skeleton>
        </div>
      </section>
    </MainLayout>
  );
};
