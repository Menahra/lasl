import type {
  TooltipContentProps as RadixTooltipContentProps,
  TooltipProps as RadixTooltipProps,
  TooltipTriggerProps as RadixTooltipTriggerProps,
} from "@radix-ui/react-tooltip";
import {
  Arrow as RadixArrow,
  Content as RadixContent,
  Portal as RadixPortal,
  Provider as RadixProvider,
  Root as RadixRoot,
  Trigger as RadixTrigger,
} from "@radix-ui/react-tooltip";
import type { PropsWithChildren } from "react";
import "./Tooltip.css";

export type TooltipProps = {
  children: PropsWithChildren["children"];
  delayDuration?: RadixTooltipProps["delayDuration"];
  asChild?: RadixTooltipTriggerProps["asChild"];
  sideOffset?: RadixTooltipContentProps["sideOffset"];
  collisionPadding?: RadixTooltipContentProps["collisionPadding"];

  /**
   * this is the text that will be shown in the tooltip
   * if it is not defined the tooltip will not be rendered
   */
  title?: string | undefined;
};

export const Tooltip = ({
  children,
  delayDuration = 550,
  asChild = true,
  sideOffset = 8,
  collisionPadding = 8,
  title,
}: TooltipProps) => {
  return (
    <RadixProvider delayDuration={delayDuration}>
      <RadixRoot>
        <RadixTrigger asChild={asChild}>{children}</RadixTrigger>
        <RadixPortal>
          {title ? (
            <RadixContent
              className="TooltipContent"
              sideOffset={sideOffset}
              collisionPadding={collisionPadding}
            >
              {title}
              <RadixArrow className="TooltipArrow" />
            </RadixContent>
          ) : undefined}
        </RadixPortal>
      </RadixRoot>
    </RadixProvider>
  );
};
