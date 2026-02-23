import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  injectJSONBMock,
  getJSONBMock,
  markdownToJSONBMock,
  jsonbToMarkdownMock,
} = vi.hoisted(() => ({
  injectJSONBMock: vi.fn(),
  getJSONBMock: vi.fn(
    () => "{\"root\":{\"children\":[{\"type\":\"paragraph\",\"children\":[{\"text\":\"hello\"}]}]}}",
  ),
  markdownToJSONBMock: vi.fn(() => ({ root: { children: [] } })),
  jsonbToMarkdownMock: vi.fn(() => "# Title\n\n- one\n- two"),
}));

vi.mock("@lyfie/luthor-headless", () => ({
  markdownToJSONB: markdownToJSONBMock,
  jsonbToMarkdown: jsonbToMarkdownMock,
}));

vi.mock("../extensive", async () => {
  const react = await import("react");
  const ExtensiveEditor = react.forwardRef(function MockExtensiveEditor(
    props: { children?: ReactNode },
    ref: react.ForwardedRef<{ injectJSONB: (value: string) => void; getJSONB: () => string }>,
  ) {
    react.useImperativeHandle(ref, () => ({
      injectJSONB: injectJSONBMock,
      getJSONB: getJSONBMock,
    }));
    return <div data-testid="md-extensive-editor">{props.children}</div>;
  });

  return {
    ExtensiveEditor,
  };
});

import { MDTextEditor } from "./MDTextEditor";

describe("MDTextEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports visual JSONB to markdown when opening markdown tab", () => {
    render(<MDTextEditor showDefaultContent={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Markdown" }));

    expect(getJSONBMock).toHaveBeenCalled();
    expect(jsonbToMarkdownMock).toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue("# Title\n\n- one\n- two");
  });

  it("imports markdown into visual mode", async () => {
    render(<MDTextEditor showDefaultContent={false} initialMode="markdown" />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "## Heading" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Visual" }));

    expect(markdownToJSONBMock).toHaveBeenCalledWith("## Heading");
    await waitFor(() => {
      expect(injectJSONBMock).toHaveBeenCalledWith(JSON.stringify({ root: { children: [] } }));
    });
  });
});
