import i18next from "i18next";
import I18NextHttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18next
	// i18next-http-backend
	// loads translations from your server
	// https://github.com/i18next/i18next-http-backend
	.use(I18NextHttpBackend)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		fallbackLng: "en",
		debug: true,

		backend: {
			loadPath: "assets/locales/{{lng}}/{{ns}}.json",
		},

		// the available namespaces
		// might be parsed from the available pages
		ns: ["common"],
		defaultNS: "common",

		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	});
