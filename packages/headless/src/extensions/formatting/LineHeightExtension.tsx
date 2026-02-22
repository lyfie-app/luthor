import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  type ElementNode,
  LexicalEditor,
  type RangeSelection,
} from "lexical";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { BaseExtension } from "../base/BaseExtension";
import { ExtensionCategory, type BaseExtensionConfig } from "../types";

export type LineHeightOption = {
  value: string;
  label: string;
  lineHeight: string;
};

export interface LineHeightConfig extends BaseExtensionConfig {
  options: readonly LineHeightOption[];
}

export type LineHeightCommands = {
  setLineHeight: (lineHeightValue: string) => void;
  clearLineHeight: () => void;
  getCurrentLineHeight: () => Promise<string | null>;
  getLineHeightOptions: () => readonly LineHeightOption[];
};

export type LineHeightStateQueries = {
  hasCustomLineHeight: () => Promise<boolean>;
};

const DEFAULT_LINE_HEIGHT_OPTIONS: readonly LineHeightOption[] = [
  { value: "default", label: "Default", lineHeight: "normal" },
  { value: "1", label: "1.0", lineHeight: "1" },
  { value: "1.15", label: "1.15", lineHeight: "1.15" },
  { value: "1.5", label: "1.5", lineHeight: "1.5" },
  { value: "1.75", label: "1.75", lineHeight: "1.75" },
  { value: "2", label: "2.0", lineHeight: "2" },
];

const DEFAULT_LINE_HEIGHT_OPTION: LineHeightOption = {
  value: "default",
  label: "Default",
  lineHeight: "normal",
};

function normalizeToken(value: string): string {
  return value.trim().toLowerCase();
}

function isValidLineHeightOptionValue(value: string): boolean {
  const normalized = normalizeToken(value);
  if (normalized === "default") {
    return true;
  }

  return parseLineHeightRatio(value) !== null;
}

function parseLineHeightRatio(value: string): string | null {
  const trimmed = value.trim();
  if (!/^\d*\.?\d+$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed.toString();
}

function sanitizeLineHeightOptions(
  options: readonly LineHeightOption[],
): readonly LineHeightOption[] {
  const seenValues = new Set<string>();
  const sanitized: LineHeightOption[] = [];

  for (const option of options) {
    const value = option.value.trim();
    const label = option.label.trim();
    const normalizedValue = normalizeToken(value);

    if (!value || !label) {
      continue;
    }

    if (!isValidLineHeightOptionValue(value)) {
      continue;
    }

    if (seenValues.has(normalizedValue)) {
      continue;
    }

    if (normalizedValue === "default") {
      seenValues.add(normalizedValue);
      sanitized.push({
        value,
        label,
        lineHeight: "normal",
      });
      continue;
    }

    const ratio = parseLineHeightRatio(String(option.lineHeight));
    if (!ratio) {
      continue;
    }

    seenValues.add(normalizedValue);
    sanitized.push({
      value,
      label,
      lineHeight: ratio,
    });
  }

  if (sanitized.length === 0) {
    return DEFAULT_LINE_HEIGHT_OPTIONS;
  }

  const hasDefaultOption = sanitized.some((option) => {
    return normalizeToken(option.value) === "default";
  });

  if (!hasDefaultOption) {
    return [DEFAULT_LINE_HEIGHT_OPTION, ...sanitized];
  }

  return sanitized;
}

export class LineHeightExtension extends BaseExtension<
  "lineHeight",
  LineHeightConfig,
  LineHeightCommands,
  LineHeightStateQueries
> {
  constructor() {
    super("lineHeight", [ExtensionCategory.Toolbar]);
    this.config = {
      options: DEFAULT_LINE_HEIGHT_OPTIONS,
      showInToolbar: true,
      category: [ExtensionCategory.Toolbar],
    };
  }

  register(): () => void {
    return () => {};
  }

  configure(config: Partial<LineHeightConfig>) {
    const nextConfig: Partial<LineHeightConfig> = { ...config };

    if (config.options) {
      nextConfig.options = sanitizeLineHeightOptions(config.options);
    }

    return super.configure(nextConfig);
  }

  getCommands(editor: LexicalEditor): LineHeightCommands {
    return {
      setLineHeight: (lineHeightValue: string) => {
        const option = this.findOption(lineHeightValue);
        if (!option) return;
        this.applyLineHeight(editor, option.lineHeight);
      },
      clearLineHeight: () => {
        this.applyLineHeight(editor, "");
      },
      getCurrentLineHeight: () => Promise.resolve(this.getCurrentLineHeightValue(editor)),
      getLineHeightOptions: () => this.config.options,
    };
  }

  getStateQueries(editor: LexicalEditor): LineHeightStateQueries {
    return {
      hasCustomLineHeight: () => Promise.resolve(this.hasCustomLineHeight(editor)),
    };
  }

  private applyLineHeight(editor: LexicalEditor, lineHeight: string) {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      $patchStyleText(selection, {
        "line-height": lineHeight,
      });

      const selectedBlocks = this.getSelectedTopLevelBlocks(selection);
      for (const block of selectedBlocks) {
        let nextStyle = this.withStyleProperty(
          block.getStyle(),
          "line-height",
          lineHeight,
        );
        const ratio = parseLineHeightRatio(lineHeight);
        nextStyle = this.withStyleProperty(
          nextStyle,
          "--luthor-line-height-ratio",
          ratio ?? "",
        );
        block.setStyle(nextStyle);
      }
    });
  }

  private getSelectedTopLevelBlocks(selection: RangeSelection): ElementNode[] {
    const blocks = new Map<string, ElementNode>();

    for (const node of selection.getNodes()) {
      const topLevel = node.getTopLevelElement();
      if (!topLevel || !$isElementNode(topLevel)) {
        continue;
      }

      if (topLevel.getType() === "root") {
        continue;
      }

      blocks.set(topLevel.getKey(), topLevel);
    }

    return [...blocks.values()];
  }

  private withStyleProperty(
    style: string,
    property: string,
    value: string,
  ): string {
    const propertyMatcher = new RegExp(`^${property}\\s*:`, "i");
    const declarations = style
      .split(";")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0)
      .filter((entry) => !propertyMatcher.test(entry));

    const nextValue = value.trim();
    if (nextValue.length > 0) {
      declarations.push(`${property}: ${nextValue}`);
    }

    return declarations.join("; ");
  }

  private hasCustomLineHeight(editor: LexicalEditor): boolean {
    let hasCustomLineHeight = false;

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const current = $getSelectionStyleValueForProperty(selection, "line-height", "");
      const normalized = this.normalizeValue(current);
      hasCustomLineHeight = normalized.length > 0 && normalized !== "normal";
    });

    return hasCustomLineHeight;
  }

  private getCurrentLineHeightValue(editor: LexicalEditor): string | null {
    let currentValue: string | null = null;

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const current = $getSelectionStyleValueForProperty(selection, "line-height", "");
      const normalizedCurrent = this.normalizeValue(current);

      if (!normalizedCurrent || normalizedCurrent === "normal") {
        currentValue = "default";
        return;
      }

      const matched = this.config.options.find((option) => {
        if (this.normalizeValue(option.value) === normalizedCurrent) {
          return true;
        }
        return this.normalizeValue(option.lineHeight) === normalizedCurrent;
      });

      currentValue = matched?.value ?? null;
    });

    return currentValue;
  }

  private findOption(value: string): LineHeightOption | undefined {
    const normalizedValue = this.normalizeValue(value);
    return this.config.options.find((option) => {
      return this.normalizeValue(option.value) === normalizedValue;
    });
  }

  private normalizeValue(value: string): string {
    const normalized = value.trim().toLowerCase().replace(/\s+/g, "");
    const ratio = parseLineHeightRatio(normalized);
    return ratio ?? normalized;
  }
}

export const lineHeightExtension = new LineHeightExtension();
