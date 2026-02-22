import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FloatingToolbar } from "./floating-toolbar";
import type { CoreEditorActiveStates, CoreEditorCommands } from "./types";

function createCommands(overrides: Partial<CoreEditorCommands> = {}): CoreEditorCommands {
  return {
    toggleBold: vi.fn(),
    toggleItalic: vi.fn(),
    toggleUnderline: vi.fn(),
    toggleStrikethrough: vi.fn(),
    formatText: vi.fn(),
    insertLink: vi.fn(),
    removeLink: vi.fn(),
    toggleParagraph: vi.fn(),
    toggleHeading: vi.fn(),
    toggleQuote: vi.fn(),
    setTextAlignment: vi.fn(),
    toggleCodeBlock: vi.fn(),
    toggleUnorderedList: vi.fn(),
    toggleOrderedList: vi.fn(),
    toggleCheckList: vi.fn(),
    indentList: vi.fn(),
    outdentList: vi.fn(),
    insertHorizontalRule: vi.fn(),
    insertTable: vi.fn(),
    insertImage: vi.fn(),
    setImageAlignment: vi.fn(),
    setImageCaption: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    showCommandPalette: vi.fn(),
    hideCommandPalette: vi.fn(),
    registerCommand: vi.fn(),
    unregisterCommand: vi.fn(),
    ...overrides,
  } as unknown as CoreEditorCommands;
}

const DEFAULT_RECT = {
  x: 20,
  y: 20,
};

describe("FloatingToolbar media caption editing", () => {
  it("loads and commits image caption draft", async () => {
    const getImageCaption = vi.fn().mockResolvedValue("existing image caption");
    const setImageCaption = vi.fn();
    const commands = createCommands({ getImageCaption, setImageCaption });

    render(
      <FloatingToolbar
        isVisible
        selectionRect={DEFAULT_RECT}
        commands={commands}
        activeStates={{ imageSelected: true } as CoreEditorActiveStates}
      />,
    );

    const input = await screen.findByLabelText("Image caption");
    await waitFor(() => {
      expect(input).toHaveValue("existing image caption");
    });
    fireEvent.change(input, { target: { value: "updated image caption" } });
    fireEvent.blur(input);

    expect(setImageCaption).toHaveBeenCalledWith("updated image caption");
  });

  it("loads and commits YouTube caption draft", async () => {
    const getYouTubeEmbedCaption = vi.fn().mockResolvedValue("existing youtube caption");
    const setYouTubeEmbedCaption = vi.fn();
    const commands = createCommands({ getYouTubeEmbedCaption, setYouTubeEmbedCaption });

    render(
      <FloatingToolbar
        isVisible
        selectionRect={DEFAULT_RECT}
        commands={commands}
        activeStates={{ isYouTubeEmbedSelected: true } as CoreEditorActiveStates}
      />,
    );

    const input = await screen.findByLabelText("YouTube caption");
    await waitFor(() => {
      expect(input).toHaveValue("existing youtube caption");
    });
    fireEvent.change(input, { target: { value: "updated youtube caption" } });
    fireEvent.blur(input);

    expect(setYouTubeEmbedCaption).toHaveBeenCalledWith("updated youtube caption");
  });
});
