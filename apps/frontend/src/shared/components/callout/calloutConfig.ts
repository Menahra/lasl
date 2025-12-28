import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

export const CALLOUT_SEVERITIES = {
  info: {
    className: "Callout--info",
    icon: InfoCircledIcon,
  },
  success: {
    className: "Callout--success",
    icon: CheckCircledIcon,
  },
  warning: {
    className: "Callout--warning",
    icon: ExclamationTriangleIcon,
  },
  error: {
    className: "Callout--error",
    icon: CrossCircledIcon,
  },
} as const;
export type CalloutSeverity = keyof typeof CALLOUT_SEVERITIES;

export const CALLOUT_VARIANTS = {
  filled: "Callout--filled",
  outlined: "Callout--outlined",
  soft: "Callout--soft",
} as const;
export type CalloutVariant = keyof typeof CALLOUT_VARIANTS;
