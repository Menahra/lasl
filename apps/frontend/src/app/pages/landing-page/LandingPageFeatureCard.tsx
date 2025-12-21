import { Trans } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./LandingPageFeatureCard.css";

export type LandingPageFeatureCardProps = {
  /** the icon for this feature shown on top left of the card */
  icon: ReactNode;
  /** the title for this feature */
  title: ReactNode;
  /** some further description */
  description: ReactNode;
  /** whether this feature is currently on roadmap */
  planned?: boolean;
};

export const LandingPageFeatureCard = ({
  icon,
  title,
  description,
  planned = false,
}: LandingPageFeatureCardProps) => {
  const { isLoading } = useI18nContext();

  return (
    <div className="FeatureCard">
      {planned ? (
        <span className="FeatureCardComingSoonBadge">
          <Trans>Coming Soon</Trans>
        </span>
      ) : undefined}
      <div className="FeatureCardIcon">
        <Skeleton loading={isLoading} width={40} height={40}>
          {icon}
        </Skeleton>
      </div>
      <h4 className="FeatureCardTitle">
        <Skeleton loading={isLoading} width={130} height={21}>
          {title}
        </Skeleton>
      </h4>
      <p className="FeatureCardDescription">
        <Skeleton loading={isLoading} width={240} height={17}>
          {description}
        </Skeleton>
      </p>
    </div>
  );
};
