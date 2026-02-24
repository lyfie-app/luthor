import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { extensiveEditorMock } = vi.hoisted(() => ({
  extensiveEditorMock: vi.fn(() => null),
}));

vi.mock("../extensive", () => ({
  ExtensiveEditor: extensiveEditorMock,
}));

import { SimpleTextEditor } from "./SimpleTextEditor";

describe("SimpleTextEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hides toolbar and disables rich features by default", () => {
    render(<SimpleTextEditor showDefaultContent={false} />);

    const props = extensiveEditorMock.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    expect(props.isToolbarEnabled).toBe(false);
    expect(props.availableModes).toEqual(["visual"]);
    expect((props.featureFlags as Record<string, boolean>).bold).toBe(false);
    expect((props.featureFlags as Record<string, boolean>).link).toBe(false);
  });

  it("allows explicitly showing toolbar", () => {
    render(
      <SimpleTextEditor
        showDefaultContent={false}
        hideToolbarByDefault={false}
        isToolbarEnabled
      />,
    );

    const props = extensiveEditorMock.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    expect(props.isToolbarEnabled).toBe(true);
  });
});
