import type { ReactNode } from "react";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./LandingPageHighlightCard.css";

type LandingPageHighlightCardProps = {
  /** the title of the highlight card shown as h4 */
  title: ReactNode;
  /** the further description of this highlight */
  description: ReactNode;
};

export const LandingPageHighlightCard = ({
  title,
  description,
}: LandingPageHighlightCardProps) => {
  const { isLoading } = useI18nContext();

  return (
    <div className="LandingPageHighlightCard">
      <Skeleton loading={isLoading} width={140} height={25}>
        <h4 className="LandingPageHighlightCardTitle">{title}</h4>
      </Skeleton>
      <Skeleton loading={isLoading} width={200} height={17}>
        <p>{description}</p>
      </Skeleton>
    </div>
  );
};
