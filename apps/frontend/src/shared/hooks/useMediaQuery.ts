import { useEffect, useState } from "react";

export const useMediaQuery = (query: string): boolean => {
  const getMatches = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    const listener = () => {
      setMatches(mediaQueryList.matches);
    };

    setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
};
