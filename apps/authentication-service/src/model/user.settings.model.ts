import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from "@lasl/app-contracts/locales";
import { prop } from "@typegoose/typegoose";

export class UserSettings {
    @prop({ default: false })
    darkMode!: boolean;

    @prop({ default: DEFAULT_LOCALE, enum: SUPPORTED_LOCALES, type: String })
    uiLanguage!: SupportedLocale;

    @prop({ default: DEFAULT_LOCALE, enum: SUPPORTED_LOCALES, type: String })
    contentLanguage!: SupportedLocale;
}
