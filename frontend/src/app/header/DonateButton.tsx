import { IconLink } from "@/src/shared/components/icon-link/IconLink";
import { useTranslation } from "react-i18next";
import KoFiLogo from "@/assets/icons/ko-fi.svg?react";

export const DonateButton = () => {
	const { t } = useTranslation();

	return (
		<IconLink
			icon={<KoFiLogo />}
			href="https://ko-fi.com/zioui"
			target="_blank"
			rel="noopener noreferrer"
			aria-label={t("header.ko-fi_donate_description")}
			title={t("header.ko-fi_donate_description")}
		/>
	);
};
