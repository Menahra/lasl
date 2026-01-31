import {
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@lasl/app-contracts/locales";
import { I18nProvider as LinguiI18nProvider } from "@lingui/react";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { userApi } from "@/src/api/userApi.ts";
import { i18n, initI18n, switchI18nLocale } from "@/src/app/i18n.ts";
import { useAuthenticationContext } from "@/src/shared/hooks/useAuthenticationContext.tsx";

type I18nProviderContext = {
  changeLocale: (newLocale: SupportedLocale) => Promise<void>;
  currentLocale: SupportedLocale;
  isLoading: boolean;
};

const I18nContext = createContext<I18nProviderContext | undefined>(undefined);

type I18nProviderProps = PropsWithChildren;

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocale, setCurrentLocale] =
    useState<SupportedLocale>(DEFAULT_LOCALE);

  const { user } = useAuthenticationContext();

  useEffect(() => {
    const initialize = async () => {
      const initialLocale = await initI18n(user?.settings.uiLanguage);
      setCurrentLocale(initialLocale);
      setIsLoading(false);
    };

    initialize();
  }, []);

  const changeLocale = async (newLocale: SupportedLocale) => {
    try {
      await switchI18nLocale(newLocale);
      setCurrentLocale(newLocale);

      if (user) {
        await userApi.updateUser(user.id, {
          ...user,
          settings: { ...user.settings, uiLanguage: newLocale },
        });
      }
    } catch (error) {
      console.error("Failed to update user language: ", error);
      throw error;
    }
  };

  const i18nProviderContextValue: I18nProviderContext = {
    changeLocale,
    currentLocale,
    isLoading,
  };

  return (
    <I18nContext.Provider value={i18nProviderContextValue}>
      {!isLoading && (
        <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>
      )}
    </I18nContext.Provider>
  );
};

// biome-ignore lint/style/useComponentExportOnlyModules: okay for context provider
export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within I18nProvider");
  }
  return context;
};
