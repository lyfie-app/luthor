import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { extensiveEditorMock } = vi.hoisted(() => ({
  extensiveEditorMock: vi.fn(() => null),
}));

vi.mock("../extensive", () => ({
  ExtensiveEditor: extensiveEditorMock,
}));

import { NotesEditor } from "./NotesEditor";

describe("NotesEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and actions by default", () => {
    render(<NotesEditor showDefaultContent={false} />);

    expect(screen.getByTestId("notes-title")).toBeInTheDocument();
    expect(screen.getByTestId("notes-actions")).toBeInTheDocument();
  });

  it("wires action callbacks", () => {
    const onPin = vi.fn();
    const onColorChange = vi.fn();

    render(<NotesEditor showDefaultContent={false} onPin={onPin} onColorChange={onColorChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Pin note" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Change note color" }), {
      target: { value: "#dbeafe" },
    });

    expect(onPin).toHaveBeenCalled();
    expect(onColorChange).toHaveBeenCalledWith("#dbeafe");
  });
});
