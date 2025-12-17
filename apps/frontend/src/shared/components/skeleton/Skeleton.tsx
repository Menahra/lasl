import type { CSSProperties, PropsWithChildren } from "react";
import "./Skeleton.css";

export type SkeletonProps = PropsWithChildren<
  Partial<
    Pick<
      CSSProperties,
      | "borderRadius"
      | "height"
      | "width"
      | "margin"
      | "flex"
      | "flexGrow"
      | "flexShrink"
      | "alignSelf"
    >
  > & {
    /**
     * this should be a stateful variable, indicating
     * whether the loading visualization of the skeleton is shown
     * or the passed children
     */
    loading: boolean;
  }
>;

export const Skeleton = ({
  loading,
  children,
  ...styleProps
}: SkeletonProps) => {
  if (loading) {
    return <span className="Skeleton" style={styleProps} />;
  }

  return <>{children}</>;
};
