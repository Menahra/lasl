import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { PropsWithChildren } from "react";

import "./styles.scss";

export type TooltipProps = {
	children: PropsWithChildren["children"];
	delayDuration?: RadixTooltip.TooltipProps["delayDuration"];
	asChild?: RadixTooltip.TooltipTriggerProps["asChild"];
	sideOffset?: RadixTooltip.TooltipContentProps["sideOffset"];
	collisionPadding?: RadixTooltip.TooltipContentProps["collisionPadding"];

	/**
	 * this is the text that will be shown in the tooltip
	 * if it is not defined the tooltip will not be rendered
	 */
	title?: string;
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
		<RadixTooltip.Provider delayDuration={delayDuration}>
			<RadixTooltip.Root>
				<RadixTooltip.Trigger asChild={asChild}>
					{children}
				</RadixTooltip.Trigger>
				<RadixTooltip.Portal>
					{title ? (
						<RadixTooltip.Content
							className="TooltipContent"
							sideOffset={sideOffset}
							collisionPadding={collisionPadding}
						>
							{title}
							<RadixTooltip.Arrow className="TooltipArrow" />
						</RadixTooltip.Content>
					) : undefined}
				</RadixTooltip.Portal>
			</RadixTooltip.Root>
		</RadixTooltip.Provider>
	);
};
