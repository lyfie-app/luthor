/* @vitest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditorContext } from "../../core/createEditorSystem";
import { RichText } from "./RichTextExtension";

vi.mock("@lexical/react/LexicalRichTextPlugin", () => ({
  RichTextPlugin: ({
    contentEditable,
    placeholder,
  }: {
    contentEditable: React.ReactElement;
    placeholder: React.ReactElement;
  }) => (
    <div data-testid="richtext-plugin">
      {contentEditable}
      {placeholder}
    </div>
  ),
}));

vi.mock("@lexical/react/LexicalContentEditable", () => ({
  ContentEditable: ({
    className,
    style,
  }: {
    className?: string;
    style?: React.CSSProperties;
  }) => <div data-testid="content-editable" className={className} style={style} />,
}));

describe("RichText placeholder behavior", () => {
  it("renders custom placeholder text for empty state with default placeholder class", () => {
    render(<RichText placeholder="Draft here..." />);

    const placeholder = screen.getByText("Draft here...");
    expect(placeholder).toHaveClass("luthor-placeholder");
  });

  it("falls back to provider config placeholder when placeholder prop is not set", () => {
    render(
      <EditorContext.Provider value={{ config: { placeholder: "Config placeholder" } } as any}>
        <RichText />
      </EditorContext.Provider>,
    );

    expect(screen.getByText("Config placeholder")).toBeInTheDocument();
  });

  it("does not force top/left/color inline placeholder styles by default", () => {
    render(<RichText placeholder="Theme controlled" />);

    const placeholder = screen.getByText("Theme controlled");
    const style = placeholder.getAttribute("style") ?? "";
    expect(style).not.toContain("top");
    expect(style).not.toContain("left");
    expect(style).not.toContain("color");
  });
});
