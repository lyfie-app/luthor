import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach } from "vitest";
import { vi } from "vitest";

const {
  registerKeyboardShortcutsMock,
  commandsToCommandPaletteItemsMock,
  commandsToSlashCommandItemsMock,
  toolbarMock,
  createExtensiveExtensionsMock,
  providerMock,
} = vi.hoisted(() => ({
  registerKeyboardShortcutsMock: vi.fn(() => vi.fn()),
  commandsToCommandPaletteItemsMock: vi.fn(() => [{ id: "mock-command" }]),
  commandsToSlashCommandItemsMock: vi.fn(() => [{ id: "mock-slash-command" }]),
  toolbarMock: vi.fn(({ classNames, toolbarStyleVars }: { classNames?: { toolbar?: string }; toolbarStyleVars?: Record<string, string> }) => (
    <div data-testid="toolbar" className={classNames?.toolbar} style={toolbarStyleVars} />
  )),
  createExtensiveExtensionsMock: vi.fn(() => []),
  providerMock: vi.fn(),
}));

vi.mock("lexical", () => ({
  $setSelection: vi.fn(),
}));

vi.mock("./extensions", () => ({
  extensiveExtensions: [],
  createExtensiveExtensions: createExtensiveExtensionsMock,
  setFloatingToolbarContext: vi.fn(),
}));

vi.mock("../../core", () => ({
  CommandPalette: () => null,
  SlashCommandMenu: () => null,
  EmojiSuggestionMenu: () => null,
  commandsToCommandPaletteItems: commandsToCommandPaletteItemsMock,
  commandsToSlashCommandItems: commandsToSlashCommandItemsMock,
  formatJSONBSource: (value: string) => value,
  ModeTabs: () => <div data-testid="mode-tabs" />,
  registerKeyboardShortcuts: registerKeyboardShortcutsMock,
  SourceView: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea value={value} onChange={(event) => onChange(event.target.value)} />
  ),
  Toolbar: toolbarMock,
  TRADITIONAL_TOOLBAR_LAYOUT: { sections: [] },
  BLOCK_HEADING_LEVELS: ["h1", "h2", "h3", "h4", "h5", "h6"],
}));

const mockEditorApi = {
  commands: {
    registerCommand: vi.fn(),
    unregisterCommand: vi.fn(),
    registerSlashCommand: vi.fn(),
    unregisterSlashCommand: vi.fn(),
    showCommandPalette: vi.fn(),
    hideCommandPalette: vi.fn(),
    closeSlashMenu: vi.fn(),
    executeSlashCommand: vi.fn(),
    closeEmojiSuggestions: vi.fn(),
    executeEmojiSuggestion: vi.fn(),
  },
  hasExtension: () => false,
  activeStates: {},
  lexical: {
    update: vi.fn(),
    getRootElement: vi.fn(() => null),
    focus: vi.fn(),
    registerUpdateListener: vi.fn(() => () => {}),
  },
  extensions: [],
  export: {
    toJSON: vi.fn(() => ({ root: { children: [] } })),
  },
  import: {
    fromJSON: vi.fn(),
  },
};

vi.mock("@lyfie/luthor-headless", () => ({
  createEditorSystem: () => ({
    Provider: ({ children, config }: { children: ReactNode; config?: unknown }) => {
      providerMock(config);
      return <>{children}</>;
    },
    useEditor: () => mockEditorApi,
  }),
  RichText: () => <div data-testid="richtext" />,
  defaultLuthorTheme: { quote: "luthor-quote" },
  mergeThemes: (_base: unknown, override: Record<string, unknown>) => ({
    quote: "luthor-quote",
    ...override,
  }),
}));

import { ExtensiveEditor } from "./ExtensiveEditor";

describe("ExtensiveEditor toolbar placement and alignment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders toolbar in the header by default with left alignment", () => {
    const { container } = render(<ExtensiveEditor showDefaultContent={false} />);

    const toolbar = screen.getByTestId("toolbar");
    const header = container.querySelector(".luthor-editor-header");

    expect(toolbar).toHaveClass("luthor-toolbar");
    expect(toolbar).toHaveClass("luthor-toolbar--align-left");
    expect(header).toContainElement(toolbar);
    expect(container.querySelector(".luthor-editor-toolbar-slot--bottom")).toBeNull();
  });

  it("renders toolbar in the bottom slot when toolbarPosition is bottom", () => {
    const { container } = render(<ExtensiveEditor showDefaultContent={false} toolbarPosition="bottom" />);

    const toolbar = screen.getByTestId("toolbar");
    const header = container.querySelector(".luthor-editor-header");
    const bottomSlot = container.querySelector(".luthor-editor-toolbar-slot--bottom");

    expect(header).not.toContainElement(toolbar);
    expect(bottomSlot).toContainElement(toolbar);
  });

  it("applies center and right alignment classes", () => {
    const { rerender } = render(
      <ExtensiveEditor
        showDefaultContent={false}
        toolbarPosition="top"
        toolbarAlignment="center"
      />,
    );

    expect(screen.getByTestId("toolbar")).toHaveClass("luthor-toolbar--align-center");

    rerender(
      <ExtensiveEditor
        showDefaultContent={false}
        toolbarPosition="top"
        toolbarAlignment="right"
      />,
    );

    expect(screen.getByTestId("toolbar")).toHaveClass("luthor-toolbar--align-right");
  });

  it("hides toolbar when isToolbarEnabled is false and keeps command wiring active", () => {
    render(<ExtensiveEditor showDefaultContent={false} isToolbarEnabled={false} />);

    expect(screen.queryByTestId("toolbar")).toBeNull();
    expect(registerKeyboardShortcutsMock).toHaveBeenCalled();
    expect(mockEditorApi.commands.registerCommand).toHaveBeenCalledWith({ id: "mock-command" });
    expect(mockEditorApi.commands.registerSlashCommand).toHaveBeenCalledWith({ id: "mock-slash-command" });
  });

  it("passes toolbarVisibility to toolbar rendering", () => {
    const toolbarVisibility = { bold: false, italic: true };

    render(<ExtensiveEditor showDefaultContent={false} toolbarVisibility={toolbarVisibility} />);

    const toolbarCall = toolbarMock.mock.calls.at(-1)?.[0] as { toolbarVisibility?: unknown };
    expect(toolbarCall.toolbarVisibility).toEqual(toolbarVisibility);
  });

  it("passes headingOptions and paragraphLabel to toolbar and command wiring by default", () => {
    const headingOptions = ["h2", "h4"] as const;

    render(
      <ExtensiveEditor
        showDefaultContent={false}
        headingOptions={headingOptions}
        paragraphLabel="Normal"
      />,
    );

    const toolbarCall = toolbarMock.mock.calls.at(-1)?.[0] as {
      headingOptions?: unknown;
      paragraphLabel?: unknown;
    };
    expect(toolbarCall.headingOptions).toEqual(headingOptions);
    expect(toolbarCall.paragraphLabel).toBe("Normal");

    expect(commandsToCommandPaletteItemsMock).toHaveBeenCalledWith(
      expect.anything(),
      { headingOptions, paragraphLabel: "Normal" },
    );
    expect(commandsToSlashCommandItemsMock).toHaveBeenCalledWith(
      expect.anything(),
      { headingOptions, paragraphLabel: "Normal" },
    );
    expect(registerKeyboardShortcutsMock).toHaveBeenCalledWith(
      expect.anything(),
      document.body,
      { headingOptions, paragraphLabel: "Normal" },
    );
  });

  it("can keep heading commands independent from toolbar options", () => {
    render(
      <ExtensiveEditor
        showDefaultContent={false}
        headingOptions={["h6"]}
        syncHeadingOptionsWithCommands={false}
      />,
    );

    expect(commandsToCommandPaletteItemsMock).toHaveBeenCalledWith(
      expect.anything(),
      { headingOptions: undefined, paragraphLabel: undefined },
    );
    expect(commandsToSlashCommandItemsMock).toHaveBeenCalledWith(
      expect.anything(),
      { headingOptions: undefined, paragraphLabel: undefined },
    );
    expect(registerKeyboardShortcutsMock).toHaveBeenCalledWith(
      expect.anything(),
      document.body,
      { headingOptions: undefined, paragraphLabel: undefined },
    );
  });

  it("applies toolbarClassName and passes toolbarStyleVars to toolbar rendering", () => {
    const toolbarStyleVars = {
      "--luthor-toolbar-button-active-bg": "#ff4d4f",
      "--luthor-toolbar-button-active-fg": "#ffffff",
    } as const;

    render(
      <ExtensiveEditor
        showDefaultContent={false}
        toolbarClassName="brand-toolbar"
        toolbarStyleVars={toolbarStyleVars}
      />,
    );

    const toolbar = screen.getByTestId("toolbar");
    expect(toolbar).toHaveClass("brand-toolbar");
    expect(toolbar).toHaveStyle({
      "--luthor-toolbar-button-active-bg": "#ff4d4f",
      "--luthor-toolbar-button-active-fg": "#ffffff",
    });
  });

  it("passes fontFamilyOptions to extension factory", () => {
    const fontFamilyOptions = [
      { value: "default", label: "Default", fontFamily: "inherit" },
      { value: "geist", label: "Geist", fontFamily: "'Geist', Arial, sans-serif" },
    ] as const;

    render(
      <ExtensiveEditor
        showDefaultContent={false}
        fontFamilyOptions={fontFamilyOptions}
      />,
    );

    expect(createExtensiveExtensionsMock).toHaveBeenCalledWith({
      fontFamilyOptions,
      fontSizeOptions: undefined,
      lineHeightOptions: undefined,
    });
  });

  it("applies quoteClassName through editor theme config", () => {
    render(
      <ExtensiveEditor
        showDefaultContent={false}
        quoteClassName="brand-quote"
      />,
    );

    const providerConfig = providerMock.mock.calls.at(-1)?.[0] as { theme?: { quote?: string } };
    expect(providerConfig.theme?.quote).toBe("luthor-quote brand-quote");
  });

  it("merges theme quote override with quoteClassName", () => {
    render(
      <ExtensiveEditor
        showDefaultContent={false}
        theme={{ quote: "custom-quote" }}
        quoteClassName="brand-quote"
      />,
    );

    const providerConfig = providerMock.mock.calls.at(-1)?.[0] as { theme?: { quote?: string } };
    expect(providerConfig.theme?.quote).toBe("custom-quote brand-quote");
  });

  it("applies quoteStyleVars on editor wrapper", () => {
    render(
      <ExtensiveEditor
        showDefaultContent={false}
        quoteStyleVars={{
          "--luthor-quote-bg": "#fef3c7",
          "--luthor-quote-fg": "#78350f",
          "--luthor-quote-border": "#d97706",
        }}
      />,
    );

    const wrapper = document.querySelector(".luthor-editor-wrapper");
    expect(wrapper).toHaveStyle({
      "--luthor-quote-bg": "#fef3c7",
      "--luthor-quote-fg": "#78350f",
      "--luthor-quote-border": "#d97706",
    });
  });

  it("passes fontSizeOptions to extension factory", () => {
    const fontSizeOptions = [
      { value: "default", label: "Default", fontSize: "inherit" },
      { value: "13", label: "13px", fontSize: "13px" },
      { value: "17", label: "17px", fontSize: "17px" },
    ] as const;

    render(
      <ExtensiveEditor
        showDefaultContent={false}
        fontSizeOptions={fontSizeOptions}
      />,
    );

    expect(createExtensiveExtensionsMock).toHaveBeenCalledWith({
      fontFamilyOptions: undefined,
      fontSizeOptions,
      lineHeightOptions: undefined,
    });
  });

  it("passes lineHeightOptions to extension factory", () => {
    const lineHeightOptions = [
      { value: "default", label: "Default", lineHeight: "normal" },
      { value: "1.3", label: "1.3", lineHeight: "1.3" },
      { value: "1.8", label: "1.8", lineHeight: "1.8" },
    ] as const;

    render(
      <ExtensiveEditor
        showDefaultContent={false}
        lineHeightOptions={lineHeightOptions}
      />,
    );

    expect(createExtensiveExtensionsMock).toHaveBeenCalledWith({
      fontFamilyOptions: undefined,
      fontSizeOptions: undefined,
      lineHeightOptions,
    });
  });
});
