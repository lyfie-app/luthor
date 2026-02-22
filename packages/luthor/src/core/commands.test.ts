import { describe, expect, it, vi } from "vitest";
import {
  commandsToCommandPaletteItems,
  commandsToSlashCommandItems,
  generateCommands,
  registerKeyboardShortcuts,
} from "./commands";
import type { CoreEditorCommands } from "./types";

function createCommands(): CoreEditorCommands {
  return {
    toggleParagraph: vi.fn(),
    toggleHeading: vi.fn(),
    toggleBold: vi.fn(),
    toggleItalic: vi.fn(),
    toggleUnderline: vi.fn(),
    toggleStrikethrough: vi.fn(),
    formatText: vi.fn(),
    insertLink: vi.fn(),
    removeLink: vi.fn(),
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
  } as unknown as CoreEditorCommands;
}

describe("command heading configuration", () => {
  it("filters generated heading commands and renames paragraph label", () => {
    const commands = generateCommands({
      headingOptions: ["h2", "h5"],
      paragraphLabel: "Normal",
    });

    expect(commands.find((command) => command.id === "block.paragraph")?.label).toBe("Normal");
    expect(commands.some((command) => command.id === "block.heading2")).toBe(true);
    expect(commands.some((command) => command.id === "block.heading5")).toBe(true);
    expect(commands.some((command) => command.id === "block.heading1")).toBe(false);
  });

  it("applies heading filtering to command palette and slash command items", () => {
    const commands = createCommands();

    const palette = commandsToCommandPaletteItems(commands, { headingOptions: ["h3"] });
    const slash = commandsToSlashCommandItems(commands, { headingOptions: ["h3"] });

    expect(palette.some((command) => command.id === "block.heading3")).toBe(true);
    expect(palette.some((command) => command.id === "block.heading2")).toBe(false);
    expect(slash.some((command) => command.id === "block.heading3")).toBe(true);
    expect(slash.some((command) => command.id === "block.heading1")).toBe(false);
  });

  it("registers keyboard shortcuts only for enabled headings", () => {
    const commands = createCommands();
    const toggleHeading = commands.toggleHeading as unknown as ReturnType<typeof vi.fn>;
    const host = document.createElement("div");
    const teardown = registerKeyboardShortcuts(
      commands,
      host,
      { headingOptions: ["h2"] },
    );

    const h2Event = new KeyboardEvent("keydown", {
      key: "2",
      ctrlKey: true,
      altKey: true,
      bubbles: true,
      cancelable: true,
    });
    host.dispatchEvent(h2Event);
    expect(toggleHeading).toHaveBeenCalledWith("h2");

    toggleHeading.mockClear();
    const h1Event = new KeyboardEvent("keydown", {
      key: "1",
      ctrlKey: true,
      altKey: true,
      bubbles: true,
      cancelable: true,
    });
    host.dispatchEvent(h1Event);
    expect(toggleHeading).not.toHaveBeenCalled();

    teardown();
  });

  it("applies slash command allowlist and denylist filtering", () => {
    const commands = createCommands();

    const slash = commandsToSlashCommandItems(commands, {
      slashCommandVisibility: {
        allowlist: ["insert.table", "block.heading2", "insert.image"],
        denylist: ["insert.image"],
      },
    });

    expect(slash.map((command) => command.id)).toEqual(["block.heading2", "insert.table"]);
  });

  it("keeps slash command order deterministic when filtering", () => {
    const commands = createCommands();

    const slash = commandsToSlashCommandItems(commands, {
      slashCommandVisibility: {
        allowlist: ["insert.table", "block.heading1", "block.quote"],
      },
    });

    expect(slash.map((command) => command.id)).toEqual([
      "block.heading1",
      "block.quote",
      "insert.table",
    ]);
  });

  it("supports slash command visibility as an enabled-id selection list", () => {
    const commands = createCommands();

    const slash = commandsToSlashCommandItems(commands, {
      slashCommandVisibility: [
        { "block.quote": true },
        { "block.paragraph": true },
        { "block.heading1": true },
        { "insert.image": false },
      ],
    });

    expect(slash.map((command) => command.id)).toEqual([
      "block.paragraph",
      "block.heading1",
      "block.quote",
    ]);
  });
});
