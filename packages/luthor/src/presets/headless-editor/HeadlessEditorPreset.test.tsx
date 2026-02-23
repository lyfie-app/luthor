import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const commands = {
  toggleBold: vi.fn(),
  toggleItalic: vi.fn(),
  toggleUnderline: vi.fn(),
  toggleUnorderedList: vi.fn(),
  undo: vi.fn(),
  redo: vi.fn(),
};

vi.mock("@lyfie/luthor-headless", async () => {
  return {
    richTextExtension: { name: "richText" },
    historyExtension: { name: "history" },
    boldExtension: { name: "bold" },
    italicExtension: { name: "italic" },
    underlineExtension: { name: "underline" },
    listExtension: { name: "list" },
    RichText: ({ placeholder }: { placeholder?: string }) => <div data-testid="headless-richtext">{placeholder}</div>,
    createEditorSystem: () => ({
      Provider: ({ children }: { children: ReactNode }) => <>{children}</>,
      useEditor: () => ({
        commands,
        activeStates: { bold: false, italic: false, underline: false },
      }),
    }),
  };
});

import { HeadlessEditorPreset } from "./HeadlessEditorPreset";

describe("HeadlessEditorPreset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders plain-labeled controls", () => {
    render(<HeadlessEditorPreset />);

    expect(screen.getByRole("button", { name: "bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "italic" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "underline" })).toBeInTheDocument();
  });

  it("wires control callbacks", () => {
    render(<HeadlessEditorPreset />);

    fireEvent.click(screen.getByRole("button", { name: "bold" }));
    fireEvent.click(screen.getByRole("button", { name: "undo" }));

    expect(commands.toggleBold).toHaveBeenCalled();
    expect(commands.undo).toHaveBeenCalled();
  });
});
