import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { extensiveEditorMock } = vi.hoisted(() => ({
  extensiveEditorMock: vi.fn(() => null),
}));

vi.mock("../extensive", () => ({
  ExtensiveEditor: extensiveEditorMock,
}));

import { NotionLikeEditor } from "./NotionLikeEditor";

describe("NotionLikeEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hides toolbar by default and enables slash + draggable defaults", () => {
    render(<NotionLikeEditor showDefaultContent={false} />);

    const props = extensiveEditorMock.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    expect(props.isToolbarEnabled).toBe(false);
    const featureFlags = props.featureFlags as Record<string, boolean>;
    expect(featureFlags.slashCommand).toBe(true);
    expect(featureFlags.draggableBlock).toBe(true);
  });

  it("allows disabling draggable blocks", () => {
    render(<NotionLikeEditor showDefaultContent={false} isDraggableEnabled={false} />);

    const props = extensiveEditorMock.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    const featureFlags = props.featureFlags as Record<string, boolean>;
    expect(featureFlags.draggableBlock).toBe(false);
  });
});
