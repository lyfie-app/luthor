import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { extensiveEditorMock } = vi.hoisted(() => ({
  extensiveEditorMock: vi.fn(() => null),
}));

vi.mock("../extensive", () => ({
  ExtensiveEditor: extensiveEditorMock,
}));

import { RichTextBoxEditor } from "./RichTextBoxEditor";

describe("RichTextBoxEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enables inline features and disables advanced media by default", () => {
    render(<RichTextBoxEditor showDefaultContent={false} />);

    const props = extensiveEditorMock.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    const featureFlags = props.featureFlags as Record<string, boolean>;
    expect(featureFlags.bold).toBe(true);
    expect(featureFlags.italic).toBe(true);
    expect(featureFlags.list).toBe(true);
    expect(featureFlags.image).toBe(false);
    expect(featureFlags.table).toBe(false);
  });

  it("applies compact toolbar class path", () => {
    render(<RichTextBoxEditor showDefaultContent={false} compactToolbar />);

    const props = extensiveEditorMock.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    expect(props.variantClassName).toContain("luthor-preset-rich-text-box--compact");
    expect(props.toolbarClassName).toContain("luthor-preset-rich-text-box__toolbar--compact");
  });
});
