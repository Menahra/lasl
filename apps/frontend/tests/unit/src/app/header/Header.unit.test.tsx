import { Header } from "@/src/app/header/Header";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("Header", () => {
  it("renders a search field (among other things)", () => {
    render(<Header />);

    expect(screen.getByRole("textbox")).toBeVisible();
  });

  it("per default search field has no value", () => {
    render(<Header />);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("search field has proper aria label and placeholder", () => {
    render(<Header />);
    const searchField = screen.getByRole("textbox");
    expect(searchField).toHaveAccessibleName("header.search_description");
    expect(searchField).toHaveAttribute(
      "placeholder",
      "header.search_placeholder",
    );
  });

  it("renders two links one for github and one for ko-fi", () => {
    render(<Header />);
    expect(screen.getAllByRole("link")).toHaveLength(2);

    ["github", "ko-fi"].forEach((link, index) => {
      expect(
        (screen.getAllByRole("link")[index] as HTMLAnchorElement).href,
      ).toContain(link);
    });
  });

  it("renders a button to change theme to light if current is dark", () => {
    vi.stubGlobal("matchMedia", (query: string) => {
      if (query === "(prefers-color-scheme: dark)") {
        return {
          matches: true, // simulate dark mode
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      };
    });
    render(<Header />);
    const button = screen.getByRole("button");
    expect(button).toBeVisible();

    expect(button).toHaveAccessibleName("header.switch_to_lightmode");
  });

  it("renders a button to change theme to dark if current is light", () => {
    vi.stubGlobal("matchMedia", (query: string) => {
      if (query === "(prefers-color-scheme: dark)") {
        return {
          matches: false, // simulate light mode
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      };
    });
    render(<Header />);
    const button = screen.getByRole("button");
    expect(button).toBeVisible();

    expect(button).toHaveAccessibleName("header.switch_to_darkmode");
  });
});
