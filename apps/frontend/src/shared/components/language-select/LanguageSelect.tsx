import { useLingui } from "@lingui/react/macro";
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "@radix-ui/react-icons";
import {
  Content as SelectContent,
  Icon as SelectIcon,
  Item as SelectItem,
  ItemIndicator as SelectItemIndicator,
  type SelectItemProps,
  ItemText as SelectItemText,
  Portal as SelectPortal,
  Root as SelectRoot,
  Trigger as SelectTrigger,
  Value as SelectValue,
  Viewport as SelectViewport,
} from "@radix-ui/react-select";
import clsx from "clsx";
import { forwardRef } from "react";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import {
  AVAILABLE_LOCALES,
  type AvailableLocales,
  LOCALE_LABELS,
} from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./LanguageSelect.css";

type LanguageSelectProps = {
  className?: string;
};

type LanguageOption = {
  locale: AvailableLocales;
  label: string;
};

const languageOptions: LanguageOption[] = AVAILABLE_LOCALES.map(
  (availableLocale) => ({
    locale: availableLocale,
    label: LOCALE_LABELS[availableLocale],
  }),
);

const LanguageSelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectItem {...props} className="LanguageSelectItem" ref={forwardedRef}>
        <SelectItemIndicator className="LanguageSelectItemIndicator">
          <CheckIcon />
        </SelectItemIndicator>
        <SelectItemText>{children}</SelectItemText>
      </SelectItem>
    );
  },
);

export const LanguageSelect = ({ className }: LanguageSelectProps) => {
  const { changeLocale, currentLocale, isLoading } = useI18nContext();
  const { t } = useLingui();

  return (
    <Skeleton loading={isLoading} width={180} height={26} alignSelf="center">
      <SelectRoot value={currentLocale} onValueChange={changeLocale}>
        <SelectTrigger
          // biome-ignore lint/security/noSecrets: classname and not a secret
          className={clsx("LanguageSelectTrigger", className)}
          aria-label={t`Language`}
        >
          <GlobeIcon />
          <SelectValue>{LOCALE_LABELS[currentLocale]}</SelectValue>
          <SelectIcon className="LanguageSelectIcon">
            <ChevronDownIcon />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent className="LanguageSelectContent" position="popper">
            <SelectViewport>
              {languageOptions.map(({ locale, label }) => (
                <LanguageSelectItem key={locale} value={locale}>
                  {label}
                </LanguageSelectItem>
              ))}
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </Skeleton>
  );
};
