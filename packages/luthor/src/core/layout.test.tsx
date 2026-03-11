import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModeTabs, SourceView } from "./layout";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ModeTabs", () => {
  it("renders available tabs in canonical order", () => {
    const { container } = render(
      <ModeTabs
        mode="visual"
        onModeChange={vi.fn()}
        availableModes={["html", "visual", "markdown", "json", "visual-only"]}
      />,
    );

    const labels = Array.from(container.querySelectorAll(".luthor-mode-tab")).map(
      (tab) => tab.textContent?.trim(),
    );
    expect(labels).toEqual(["Visual Only", "Visual Editor", "JSON", "Markdown", "HTML"]);
  });

  it("supports custom labels and conversion spinner", () => {
    const { container } = render(
      <ModeTabs
        mode="markdown"
        onModeChange={vi.fn()}
        availableModes={["visual-only", "visual", "markdown", "html"]}
        labels={{ "visual-only": "Preview", markdown: "MD", html: "Markup" }}
        isConverting="html"
      />,
    );

    expect(container.querySelector(".luthor-mode-tab.active")?.textContent).toContain("MD");
    expect(container.textContent).toContain("Preview");
    expect(container.textContent).toContain("Markup");
    expect(container.querySelectorAll(".luthor-tab-converting-spinner")).toHaveLength(1);
  });

  it("maps visual-editor tab clicks back to legacy visual when only legacy mode is available", () => {
    const onModeChange = vi.fn();
    const { getByRole } = render(
      <ModeTabs
        mode="json"
        onModeChange={onModeChange}
        availableModes={["visual", "json"]}
      />,
    );

    getByRole("button", { name: "Visual Editor" }).click();
    expect(onModeChange).toHaveBeenCalledWith("visual");
  });

  it("emits visual-editor when canonical mode is available", () => {
    const onModeChange = vi.fn();
    const { getByRole } = render(
      <ModeTabs
        mode="json"
        onModeChange={onModeChange}
        availableModes={["visual-editor", "json"]}
      />,
    );

    getByRole("button", { name: "Visual Editor" }).click();
    expect(onModeChange).toHaveBeenCalledWith("visual-editor");
  });
});

describe("SourceView", () => {
  it("accounts for textarea chrome while auto-sizing", () => {
    vi.spyOn(HTMLTextAreaElement.prototype, "scrollHeight", "get").mockReturnValue(520);
    vi.spyOn(HTMLTextAreaElement.prototype, "offsetHeight", "get").mockReturnValue(420);
    vi.spyOn(HTMLTextAreaElement.prototype, "clientHeight", "get").mockReturnValue(400);

    const { container } = render(
      <SourceView value="{}" onChange={vi.fn()} placeholder="Paste JSON..." />,
    );

    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.style.height).toBe("541px");
  });

  it("keeps a visual-aligned minimum height for source modes", () => {
    vi.spyOn(HTMLTextAreaElement.prototype, "scrollHeight", "get").mockReturnValue(120);
    vi.spyOn(HTMLTextAreaElement.prototype, "offsetHeight", "get").mockReturnValue(400);
    vi.spyOn(HTMLTextAreaElement.prototype, "clientHeight", "get").mockReturnValue(398);

    const { container } = render(
      <SourceView value="{}" onChange={vi.fn()} placeholder="Paste JSON..." />,
    );

    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.style.height).toBe("400px");
  });
});
