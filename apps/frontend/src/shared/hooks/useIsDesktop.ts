import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery.ts";

// should match --container-3xl
export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");
