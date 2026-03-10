import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModeTabs } from "./layout";

describe("ModeTabs", () => {
  it("renders available tabs in canonical order", () => {
    const { container } = render(
      <ModeTabs
        mode="visual"
        onModeChange={vi.fn()}
        availableModes={["html", "visual", "markdown", "json"]}
      />,
    );

    const labels = Array.from(container.querySelectorAll(".luthor-mode-tab")).map(
      (tab) => tab.textContent?.trim(),
    );
    expect(labels).toEqual(["Visual", "JSON", "Markdown", "HTML"]);
  });

  it("supports custom labels and conversion spinner", () => {
    const { container } = render(
      <ModeTabs
        mode="markdown"
        onModeChange={vi.fn()}
        availableModes={["visual", "markdown", "html"]}
        labels={{ markdown: "MD", html: "Markup" }}
        isConverting="html"
      />,
    );

    expect(container.querySelector(".luthor-mode-tab.active")?.textContent).toContain("MD");
    expect(container.textContent).toContain("Markup");
    expect(container.querySelectorAll(".luthor-tab-converting-spinner")).toHaveLength(1);
  });
});
